using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Dal.Enums;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Services.Dtos.Race;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Services.Services;

public class RaceService : IRaceService
{
    private readonly PigeonPulseDbContext _context;
    private readonly IMapper _mapper;

    public RaceService(PigeonPulseDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<RaceDto> CreateRaceAsync(int userId, CreateRaceDto raceDto)
    {
        var race = _mapper.Map<Race>(raceDto);
        race.RaceStatusId = (int)RaceStatusEnum.New;
        _context.Races.Add(race);
        await _context.SaveChangesAsync();
        return _mapper.Map<RaceDto>(race);
    }

    public async Task<RaceResultDto> AddRaceResultAsync(int userId, CreateRaceResultDto raceResultDto)
    {
        var race = await _context.Races.FindAsync(raceResultDto.RaceId);
        if (race == null) throw new KeyNotFoundException("Race not found.");
        
        var pigeon = await _context.Pigeons.FindAsync(raceResultDto.PigeonId);
        if (pigeon == null || pigeon.UserId != userId)
            throw new UnauthorizedAccessException("Pigeon not found or not owned by user.");

        var raceResult = _mapper.Map<Raceresult>(raceResultDto);
        _context.RaceResults.Add(raceResult);
        race.RaceStatusId = (int)RaceStatusEnum.Finished;
        await _context.SaveChangesAsync();
        return _mapper.Map<RaceResultDto>(raceResult);
    }

    public async Task<List<RaceDto>> GetAllRacesAsync(int userId)
    {
        var races = await _context.Races
            .Include(r => r.Raceresults)
            .Include(r => r.RaceStatus)
            .Include(r => r.Baskets)
            .ThenInclude(b => b.Pigeon)
            //.Where(r => r.Baskets.Any(b => b.UserId == userId) || r.Raceresults.Any(rr => rr.Pigeon.UserId == userId))
            .ToListAsync();
        return _mapper.Map<List<RaceDto>>(races);
    }

    public async Task<BasketDto> AddPigeonToBasketAsync(int userId, BasketPigeonDto basketPigeonDto)
    {
        var pigeon = await _context.Pigeons.FindAsync(basketPigeonDto.PigeonId);
        if (pigeon == null || pigeon.UserId != userId)
            throw new UnauthorizedAccessException("Pigeon not found or not owned by user.");

        var basket = new Basket
        {
            UserId = userId,
            PigeonId = basketPigeonDto.PigeonId,
            RaceId = basketPigeonDto.RaceId,
            BasketedAt = DateTime.UtcNow
        };
        _context.Baskets.Add(basket);
        await _context.SaveChangesAsync();
        return _mapper.Map<BasketDto>(basket);
    }

    public async Task RemovePigeonFromBasketAsync(int userId, int basketId)
    {
        var basket = await _context.Baskets.FindAsync(basketId);
        if (basket == null || basket.UserId != userId)
            throw new UnauthorizedAccessException("Basket not found or not owned by user.");
        _context.Baskets.Remove(basket);
        await _context.SaveChangesAsync();
    }

    public async Task<RaceDto> UpdateRaceStatusAsync(int userId, int raceId, string statusName)
    {
        var race = await _context.Races
            .Include(r => r.Baskets)
            .FirstOrDefaultAsync(r => r.Id == raceId);
        if (race == null || !race.Baskets.Any(b => b.UserId == userId))
            throw new UnauthorizedAccessException("Race not found or not accessible.");

        var status = Enum.TryParse<RaceStatusEnum>(statusName, true, out var parsedStatus)
            ? parsedStatus
            : throw new ArgumentException("Invalid status name.");
        race.RaceStatusId = (int)status;
        await _context.SaveChangesAsync();
        return _mapper.Map<RaceDto>(race);
    }

    public async Task<List<BasketDto>> GetBasketsByRaceIdAsync(int userId, int raceId)
    {
        var baskets = await _context.Baskets
            .Include(b => b.Pigeon)
            .Where(b => b.RaceId == raceId && b.UserId == userId)
            .ToListAsync();
        return _mapper.Map<List<BasketDto>>(baskets);
    }

    public async Task<List<RaceResultDto>> GetRaceLeaderBoardAsync(int userId, int raceId)
    {
        var race = await _context.Races
            .Include(r => r.Raceresults)
            .ThenInclude(rr => rr.Pigeon)
            .FirstOrDefaultAsync(r => r.Id == raceId);
        if (race == null || !race.Raceresults.Any(rr => rr.Pigeon.UserId == userId))
            throw new UnauthorizedAccessException("Race not found or not accessible.");
        
        var results = race.Raceresults.OrderBy(rr => rr.FinishTime).ToList();
        return _mapper.Map<List<RaceResultDto>>(results);
    }
}