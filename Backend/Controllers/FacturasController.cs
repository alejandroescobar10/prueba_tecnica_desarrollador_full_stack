using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FacturasController : ControllerBase
{
    private readonly IFacturaRepository _repository;

    // Inyección de Dependencias a través del constructor
    public FacturasController(IFacturaRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Factura>> Get([FromQuery] string clienteId)
    {
        if (string.IsNullOrWhiteSpace(clienteId))
        {
            return BadRequest("El ClienteID es requerido.");
        }

        var facturasCliente = _repository.ObtenerFacturasPorCliente(clienteId);

        return Ok(facturasCliente);
    }
}
