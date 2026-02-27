using Backend.Models;

namespace Backend.Repositories;

public class FacturaRepository : IFacturaRepository
{
    // Simulación de base de datos en memoria
    private static readonly List<Factura> _facturas = new()
    {
        new Factura { FacturaID = "F001", ClienteID = "C123", Fecha = new DateTime(2023, 10, 1), Monto = 1500.50m, Estado = "Pagada" },
        new Factura { FacturaID = "F002", ClienteID = "C123", Fecha = new DateTime(2023, 10, 5), Monto = 200.00m, Estado = "Pendiente" },
        new Factura { FacturaID = "F003", ClienteID = "C123", Fecha = new DateTime(2023, 9, 20), Monto = 5000.00m, Estado = "Anulada" },
        new Factura { FacturaID = "F004", ClienteID = "C456", Fecha = new DateTime(2023, 10, 2), Monto = 300.00m, Estado = "Pagada" },
        new Factura { FacturaID = "F005", ClienteID = "C123", Fecha = new DateTime(2023, 11, 1), Monto = 1200.00m, Estado = "Pagada" }
    };

    public IEnumerable<Factura> ObtenerFacturasPorCliente(string clienteId)
    {
        // Lógica de acceso a datos: Filtrar y ordenar
        return _facturas
            .Where(f => f.ClienteID == clienteId && f.Estado != "Anulada")
            .OrderByDescending(f => f.Fecha);
    }
}
