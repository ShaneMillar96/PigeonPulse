using PigeonPulse.Services.Dtos.Race;

namespace PigeonPulse.Services.Dtos.Leaderboard;

public class LeaderboardDto
{
    public string RaceName { get; set; }
    public List<RaceResultDto> Results { get; set; }
}