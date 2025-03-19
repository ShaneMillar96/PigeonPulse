using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Dal.Enums;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Services.Dtos.Dashboard;
using PigeonPulse.Services.Dtos.Race;
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
        var pigeons = await _context.Pigeons
                                    .Where(p => p.UserId == userId)
                                    .ToListAsync();

        var races = await _context.Races
                                  .Include(r => r.RaceResults)
                                  .Where(r => r.UserId == userId)
                                  .ToListAsync();

        var raceResults = await _context.RaceResults
                                        .Include(rr => rr.Pigeon)
                                        .Where(rr => rr.UserId == userId)
                                        .ToListAsync();

        var bestPigeon = raceResults.Any() ? raceResults.MinBy(rr => rr.FinishTime) : null;
        var bestPigeonDto = bestPigeon != null ? _mapper.Map<BestPigeonDto>(bestPigeon) : null;

        var validRaces = races.Where(r => r.RaceResults.Any()).ToList();
        var bestRace = validRaces.Any()
            ? validRaces.MinBy(r => r.RaceResults.Max(rr => rr.FinishTime) - r.RaceResults.Min(rr => rr.FinishTime))
            : null;
        var bestRaceDto = bestRace != null ? _mapper.Map<BestRaceDto>(bestRace) : null;

        var upcomingRaces = races
            .Where(r => r.Date >= DateTime.UtcNow && r.RaceStatusId != (int)RaceStatusEnum.Finished)
            .OrderBy(r => r.Date)
            .Take(5)
            .Select(r => _mapper.Map<RaceSummaryDto>(r))
            .ToList();

        var mostActivePigeon = raceResults.GroupBy(rr => rr.PigeonId)
                                           .OrderByDescending(g => g.Count())
                                           .Select(g => _mapper.Map<MostActivePigeonDto>(g.First().Pigeon))
                                           .FirstOrDefault();

        var bestLongRangePigeon = raceResults
            .Where(rr => rr.Race != null) // Ensure race data is available
            .OrderByDescending(rr => rr.Race.Distance)
            .Select(rr => _mapper.Map<BestLongRangePigeonDto>(rr.Pigeon))
            .FirstOrDefault();

        return new DashboardDto
        {
            BestPigeon = bestPigeonDto,
            BestRace = bestRaceDto,
            TotalPigeons = pigeons.Count,
            TotalRaces = races.Count,
            UpcomingRaces = upcomingRaces,
            MostActivePigeon = mostActivePigeon,
            BestLongRangePigeon = bestLongRangePigeon
        };
    }
}