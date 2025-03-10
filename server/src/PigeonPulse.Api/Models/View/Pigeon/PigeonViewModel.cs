namespace PigeonPulse.Api.Models.View.Pigeon;

public class PigeonViewModel
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; }
    public string RingNumber { get; set; }
    public string Strain { get; set; }
    public string Color { get; set; }
    public DateTime CreatedDate { get; set; }
}