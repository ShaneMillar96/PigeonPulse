namespace PigeonPulse.Services.Dtos.Race;

public class UpdateRaceDto
{
    public string Name { get; set; }
    public DateTime Date { get; set; }
    public decimal Distance { get; set; }
    public string WeatherConditions { get; set; }
}