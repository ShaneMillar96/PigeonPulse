namespace PigeonPulse.Services.Dtos.Pigeon;

public class CreatePairedPigeonDto
{
    public string RingNumber { get; set; }
    public string Color { get; set; }

    public string Sex { get; set; }
    public int FatherId { get; set; }
    public int MotherId { get; set; }
}