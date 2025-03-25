namespace PigeonPulse.Services.Dtos.Race;

public class RaceResultDto
{
    public int Id { get; set; }
    public int PigeonId { get; set; }
    public string RingNumber { get; set; } 
    public TimeSpan TimeRecorded { get; set; }
}