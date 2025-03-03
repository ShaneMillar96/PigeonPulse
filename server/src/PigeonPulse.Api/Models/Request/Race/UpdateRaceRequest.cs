namespace PigeonPulse.Api.Models.Request.Race;

public class UpdateRaceRequest
{
    public string Name { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public decimal Distance { get; set; }
    public string WeatherConditions { get; set; } = string.Empty;
}