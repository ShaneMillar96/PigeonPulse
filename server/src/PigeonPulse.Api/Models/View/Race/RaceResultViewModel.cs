namespace PigeonPulse.Api.Models.View.Race;

public class RaceResultViewModel
{
    public int Id { get; set; }
    public int PigeonId { get; set; }
    public string RingNumber { get; set; } 
    public TimeSpan TimeRecorded { get; set; }
}