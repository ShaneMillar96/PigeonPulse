namespace PigeonPulse.Api.Models.View;

public class RaceResultViewModel
{
    public int Id { get; set; }
    public int PigeonId { get; set; }
    public string PigeonName { get; set; } 
    public DateTime FinishTime { get; set; }
    public decimal? Speed { get; set; }
}