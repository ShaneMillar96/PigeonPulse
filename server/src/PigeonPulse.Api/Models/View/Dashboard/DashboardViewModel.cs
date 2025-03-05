namespace PigeonPulse.Api.Models.View.Dashboard;

public class DashboardViewModel
{
    public BestPigeonViewModel BestPigeon { get; set; }
    public BestRaceViewModel BestRace { get; set; }
    
    public List<RaceSummaryViewModel> UpcomingRaces { get; set; }
   
    public MostActivePigeonViewModel? MostActivePigeon { get; set; }
    
    public BestLongRangePigeonViewModel? BestLongRangePigeon { get; set; }

    public int TotalPigeons { get; set; }
    
    public int TotalRaces { get; set; }
}