namespace PigeonPulse.Services.Dtos.Race;

public class RaceResultDto
{
    public int Id { get; set; }
    public int PigeonId { get; set; }
    public string PigeonName { get; set; } 
    public TimeSpan TimeRecorded { get; set; }
}