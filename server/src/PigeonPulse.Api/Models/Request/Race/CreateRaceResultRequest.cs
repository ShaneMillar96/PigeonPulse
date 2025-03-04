namespace PigeonPulse.Api.Models.Request.Race;

public class CreateRaceResultRequest
{
    public int PigeonId { get; set; }
    public int RaceId { get; set; }
    public TimeSpan TimeRecorded { get; set; }
}