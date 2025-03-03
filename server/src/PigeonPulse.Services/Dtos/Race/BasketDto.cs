namespace PigeonPulse.Services.Dtos.Race;

public class BasketDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int PigeonId { get; set; }
    public int RaceId { get; set; }
    public DateTime BasketedAt { get; set; }
    public string PigeonName { get; set; }
}