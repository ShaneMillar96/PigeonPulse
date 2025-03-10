namespace PigeonPulse.Api.Models.Request.Pigeon;

public class UpdatePigeonRequest
{
    public string Name { get; set; }
    public string RingNumber { get; set; }
    public string Strain { get; set; }
    public string Color { get; set; }
    public string ImageUrl { get; set; }
}