namespace PigeonPulse.Api.Models.Request.Pigeon;

public class CreatePigeonRequest
{
    public string RingNumber { get; set; }
    public string Strain { get; set; }
    public string Color { get; set; }
    public string ImageUrl { get; set; }
    public string Sex { get; set; }
}