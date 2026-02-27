"use client";

import { useState } from "react";
import { Factura } from "../types/factura";
import { facturaService } from "../services/facturaService";

export default function Home() {
  const [clienteId, setClienteId] = useState("");
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [minMonto, setMinMonto] = useState<number | "">("");

  const buscarFacturas = async () => {
    if (!clienteId.trim()) {
      setError("Por favor ingrese un Cliente ID");
      return;
    }

    setLoading(true);
    setError("");
    setFacturas([]);

    try {
      const data = await facturaService.getByClienteId(clienteId);
      setFacturas(data);
      
      if (data.length === 0) {
        setError("No se encontraron facturas para este cliente.");
      }
    } catch (err) {
      setError("Ocurrió un error al conectar con el servidor. Asegúrate de que el backend esté corriendo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const facturasFiltradas = minMonto === "" 
    ? facturas 
    : facturas.filter(f => f.monto > Number(minMonto));

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50 text-gray-900">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Consulta de Facturas</h1>

        {/* Buscador */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Ingrese Cliente ID (ej. C123)"
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && buscarFacturas()}
          />
          <button
            onClick={buscarFacturas}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {/* Filtro Rápido */}
        {facturas.length > 0 && (
          <div className="mb-4 flex items-center gap-2 bg-blue-50 p-3 rounded">
            <label className="font-medium text-sm text-blue-800">Filtrar monto mayor a:</label>
            <input
              type="number"
              placeholder="0"
              className="p-1 border border-blue-200 rounded w-24 text-sm"
              value={minMonto}
              onChange={(e) => setMinMonto(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>
        )}

        {/* Mensajes de Error */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Tabla de Resultados */}
        {facturasFiltradas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Factura ID</th>
                  <th className="py-3 px-6 text-left">Fecha</th>
                  <th className="py-3 px-6 text-right">Monto</th>
                  <th className="py-3 px-6 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {facturasFiltradas.map((factura) => (
                  <tr key={factura.facturaID} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{factura.facturaID}</td>
                    <td className="py-3 px-6 text-left">
                      {new Date(factura.fecha).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-right font-bold text-green-600">
                      ${factura.monto.toFixed(2)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className={`py-1 px-3 rounded-full text-xs 
                        ${factura.estado === 'Pagada' ? 'bg-green-200 text-green-800' : 
                          factura.estado === 'Pendiente' ? 'bg-yellow-200 text-yellow-800' : 
                          'bg-gray-200 text-gray-800'}`}>
                        {factura.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && !error && facturas.length > 0 && (
             <p className="text-center text-gray-500 mt-4">No hay facturas que coincidan con el filtro de monto.</p>
          )
        )}
      </div>
    </main>
  );
}
