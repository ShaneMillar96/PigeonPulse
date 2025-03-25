namespace PigeonPulse.Services.Dtos.Pigeon;

public class PigeonDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string RingNumber { get; set; }
    public string Sex { get; set; }
    public string Color { get; set; }
    public DateTime CreatedDate { get; set; }
}