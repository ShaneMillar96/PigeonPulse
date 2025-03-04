using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Services.Dtos.Dashboard;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Services.Services;

public class DashboardService : IDashboardService
{
    private readonly PigeonPulseDbContext _context;
    private readonly IMapper _mapper;
    
    public DashboardService(PigeonPulseDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    public async Task<DashboardDto> GetDashboardData(int userId)
    {
        var pigeons = await _context.Pigeons.Where(p => p.UserId == userId).ToListAsync();
        var races = await _context.Races.Include(x => x.RaceResults)
            .Where(r => r.UserId == userId).ToListAsync();
        var raceResults = await _context.RaceResults.Include(rr => rr.Pigeon).ToListAsync();

        var bestPigeon = raceResults.MinBy(rr => rr.FinishTime);
        var bestPigeonDto = _mapper.Map<BestPigeonDto>(bestPigeon);

        var bestRace = races.Where(r => r.RaceResults.Any()).MinBy(r =>
            r.RaceResults.Max(rr => rr.FinishTime) - r.RaceResults.Min(rr => rr.FinishTime));
        var bestRaceDto = _mapper.Map<BestRaceDto>(bestRace);

        return new DashboardDto
        {
            BestPigeon = bestPigeonDto,
            BestRace = bestRaceDto,
            TotalPigeons = pigeons.Count,
            TotalRaces = races.Count
        };
    }


}