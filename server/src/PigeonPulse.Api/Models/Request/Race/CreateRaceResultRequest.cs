namespace PigeonPulse.Api.Models.Request.Race;

public class CreateRaceResultRequest
{
    public int PigeonId { get; set; }
    public DateTime FinishTime { get; set; }
    public int Position { get; set; }
}