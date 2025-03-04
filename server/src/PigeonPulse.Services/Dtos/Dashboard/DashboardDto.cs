using PigeonPulse.Services.Dtos.Race;

namespace PigeonPulse.Services.Dtos.Dashboard;

public class DashboardDto
{
    public BestPigeonDto BestPigeon { get; set; }
    public BestRaceDto BestRace { get; set; }
    
    public List<RaceSummaryDto> UpcomingRaces { get; set; }
   
    public MostActivePigeonDto? MostActivePigeon { get; set; }
    
    public BestLongRangePigeonDto? BestLongRangePigeon { get; set; }

    public int TotalPigeons { get; set; }
    
    public int TotalRaces { get; set; }
    
}