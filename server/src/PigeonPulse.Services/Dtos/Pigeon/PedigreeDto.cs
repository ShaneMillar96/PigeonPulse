namespace PigeonPulse.Services.Dtos.Pigeon;

public class PedigreeDto
{
    public int PigeonId { get; set; }
    public string RingNumber { get; set; }
    public string Color { get; set; }
    public string Sex { get; set; }

    public PedigreeDto? Father { get; set; }
    public PedigreeDto? Mother { get; set; }
}
