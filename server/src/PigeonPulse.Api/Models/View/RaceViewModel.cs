namespace PigeonPulse.Api.Models.View;

public class RaceViewModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime Date { get; set; }
    public decimal Distance { get; set; }
    public string WeatherConditions { get; set; }
}