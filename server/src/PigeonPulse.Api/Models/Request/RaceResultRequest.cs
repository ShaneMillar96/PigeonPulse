namespace PigeonPulse.Api.Models.Request;

public class RaceResultRequest
{
    public int PigeonId { get; set; }
    public int RaceId { get; set; }
    public DateTime FinishTime { get; set; }
    public decimal Speed { get; set; }
}