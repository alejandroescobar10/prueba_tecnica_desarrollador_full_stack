# Prueba Técnica - Migración de Sistema de Facturación

Este repositorio contiene la solución a la prueba técnica para migrar un módulo legado de consulta de facturas a una arquitectura moderna desacoplada.

## Estructura del Proyecto

- **Backend/**: API REST construida con .NET 8 (C#).
- **frontend/**: Aplicación web construida con Next.js (React) y Tailwind CSS.

## Instrucciones de Ejecución

### Prerrequisitos
- .NET SDK 8.0 o superior
- Node.js 18+ y npm

### 1. Ejecutar el Backend

1. Navega a la carpeta del backend:
   ```bash
   cd Backend
   ```
2. Ejecuta la aplicación:
   ```bash
   dotnet run
   ```
   La API estará disponible en `http://localhost:5000` (o el puerto que asigne Kestrel, verificar en consola).
   
   *Nota: La solución utiliza una lista en memoria para simular la base de datos. Los datos se reinician cada vez que se detiene el servidor.*

### 2. Ejecutar el Frontend

1. Navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:3000` en tu navegador.

## Decisiones Arquitectónicas

1. **Separación de Responsabilidades**: Se desacopló la lógica de negocio (Backend) de la presentación (Frontend), permitiendo escalar cada parte independientemente.
2. **API RESTful**: Se diseñó un endpoint `/api/facturas` que acepta parámetros vía Query String, siguiendo estándares REST.
3. **In-Memory Data**: Para propósitos de la prueba, se utilizó una lista estática en el controlador. En un entorno real, esto se reemplazaría por un `DbContext` de Entity Framework Core conectado a SQL Server.
4. **Frontend Moderno**: Se eligió Next.js por su optimización y facilidad de uso con React. Tailwind CSS permite un desarrollo rápido de UI responsiva.

---

## Respuestas a Preguntas Teóricas

### 1. Seguridad
**Pregunta:** ¿Cómo implementarías la seguridad en la nueva API .NET para asegurar que solo los usuarios autenticados de la compañía puedan consultar las facturas?

**Respuesta:**
Implementaría autenticación basada en **JWT (JSON Web Tokens)**. 
1.  Crearía un endpoint de `Login` que valide credenciales contra un proveedor de identidad (IdentityServer, Auth0 o base de datos propia) y retorne un token firmado.
2.  En la API, usaría el middleware de autenticación de ASP.NET Core (`[Authorize]`) para proteger los endpoints.
3.  El token incluiría "Claims" (reclamaciones) como el `Rol` o el `ClienteID` del usuario.
4.  Validaría en el controlador que el usuario autenticado solo pueda solicitar facturas asociadas a su propio `ClienteID` (Autorización basada en recursos), evitando que un usuario consulte datos de otro.

### 2. Integración ERP
**Pregunta:** Si esta nueva API tuviera que integrarse con nuestro ERP corporativo (donde las consultas son pesadas), ¿qué estrategias usarías para evitar tiempos de espera excesivos?

**Respuesta:**
Utilizaría una combinación de **Caché y Procesamiento Asíncrono**:
1.  **Caché Distribuido (Redis):** Almacenaría los resultados de consultas frecuentes (como el historial de facturas de un mes cerrado) en Redis con un tiempo de expiración (TTL). Si la data ya está en caché, la API responde en milisegundos sin tocar el ERP.
2.  **Patrón CQRS (Command Query Responsibility Segregation):** Separaría las operaciones de lectura y escritura. Podríamos tener una base de datos de lectura (Read Replica) optimizada y sincronizada con el ERP, para no impactar el rendimiento transaccional del sistema principal.
3.  **Procesamiento en Segundo Plano (Background Jobs):** Si la consulta es extremadamente pesada, la API no debería esperar. El usuario solicita el reporte, la API devuelve un "TicketID", y un worker procesa la consulta en segundo plano. El frontend puede hacer *polling* o usar WebSockets para notificar cuando el reporte esté listo.
