import { Factura } from "../types/factura";

const API_URL = "http://localhost:5000/api/facturas";

export const facturaService = {
  async getByClienteId(clienteId: string): Promise<Factura[]> {
    const response = await fetch(`${API_URL}?clienteId=${clienteId}`);
    
    if (!response.ok) {
      throw new Error("Error al consultar la API");
    }

    return response.json();
  }
};
