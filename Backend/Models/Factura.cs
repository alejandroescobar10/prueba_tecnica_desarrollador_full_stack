namespace Backend.Models;

public class Factura
{
    public string FacturaID { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
    public decimal Monto { get; set; }
    public string Estado { get; set; } = string.Empty;
    public string ClienteID { get; set; } = string.Empty;
}
