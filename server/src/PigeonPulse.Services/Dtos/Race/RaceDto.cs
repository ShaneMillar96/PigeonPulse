namespace PigeonPulse.Services.Dtos.Race;

public class RaceDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime Date { get; set; }
    public decimal Distance { get; set; }
    public string? WeatherConditions { get; set; }
    public List<RaceResultDto> Raceresults { get; set; } = new List<RaceResultDto>();
}