namespace PigeonPulse.Api.Models.View.Pigeon;

public class PigeonViewModel
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string RingNumber { get; set; }
    public string Sex { get; set; }
    public string Color { get; set; }
    public int? FatherId { get; set; }
    public int? MotherId { get; set; }
    public DateTime CreatedDate { get; set; }
}