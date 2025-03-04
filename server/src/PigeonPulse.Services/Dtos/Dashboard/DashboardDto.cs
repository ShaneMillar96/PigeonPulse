namespace PigeonPulse.Services.Dtos.Dashboard;

public class DashboardDto
{
    public BestPigeonDto BestPigeon { get; set; }
    public BestRaceDto BestRace { get; set; }
    
    public int TotalPigeons { get; set; }
    
    public int TotalRaces { get; set; }
    
}