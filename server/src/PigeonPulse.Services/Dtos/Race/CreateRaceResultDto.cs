namespace PigeonPulse.Services.Dtos.Race;

public class CreateRaceResultDto
{
    public int PigeonId { get; set; }
    public int RaceId { get; set; }
    public DateTime FinishTime { get; set; }
    public decimal Speed { get; set; }
}