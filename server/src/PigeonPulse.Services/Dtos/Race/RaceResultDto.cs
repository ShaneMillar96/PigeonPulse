namespace PigeonPulse.Services.Dtos.Race;

public class RaceResultDto
{
    public int Id { get; set; }
    public int PigeonId { get; set; }
    public string PigeonName { get; set; } 
    public DateTime FinishTime { get; set; }
    public decimal? Speed { get; set; }
}