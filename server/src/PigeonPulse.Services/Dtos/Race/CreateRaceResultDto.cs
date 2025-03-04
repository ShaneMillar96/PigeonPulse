namespace PigeonPulse.Services.Dtos.Race;

public class CreateRaceResultDto
{
    public int PigeonId { get; set; }
    public int RaceId { get; set; }
    public TimeSpan TimeRecorded { get; set; }
}