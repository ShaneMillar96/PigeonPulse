namespace PigeonPulse.Api.Models.Request;

public class RaceRequest
{
    public string Name { get; set; }
    public DateTime Date { get; set; }
    public decimal Distance { get; set; }
    public string WeatherConditions { get; set; }
}