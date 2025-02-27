namespace PigeonPulse.Services.Dtos;

public class RaceResultDto
{
    public int Id { get; set; }
    public int PigeonId { get; set; }
    public int RaceId { get; set; }
    public DateTime FinishTime { get; set; }
    public decimal Speed { get; set; }
}