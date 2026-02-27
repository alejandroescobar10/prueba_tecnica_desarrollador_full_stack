using Backend.Models;

namespace Backend.Repositories;

public interface IFacturaRepository
{
    IEnumerable<Factura> ObtenerFacturasPorCliente(string clienteId);
}
