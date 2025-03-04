using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Dal.Enums;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Services.Dtos.Race;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Services.Services
{
    public class RaceService : IRaceService
    {
        private readonly PigeonPulseDbContext _context;
        private readonly IMapper _mapper;

        public RaceService(PigeonPulseDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<RaceDto>> GetAllRacesAsync(int currentUser)
        {
            var races = await _context.Races
                .Include(x => x.RaceStatus)
                .Where(r => r.UserId == currentUser)
                .ToListAsync();
            return _mapper.Map<List<RaceDto>>(races);
        }

        public async Task<RaceDto> GetRaceByIdAsync(int raceId)
        {
            var race = await _context.Races.FindAsync(raceId);
            return _mapper.Map<RaceDto>(race);
        }

        public async Task<RaceDto> CreateRaceAsync(int userId, CreateRaceDto raceDto)
        {
            var race = _mapper.Map<Race>(raceDto);
            race.UserId = userId;
            race.RaceStatusId = (int)RaceStatusEnum.New;
            _context.Races.Add(race);
            await _context.SaveChangesAsync();
            return _mapper.Map<RaceDto>(race);
        }

        public async Task<RaceDto> UpdateRaceAsync(int userId, int raceId, UpdateRaceDto raceDto)
        {
            var race = await _context.Races.FirstOrDefaultAsync(r => r.Id == raceId && r.UserId == userId);
            if (race == null) throw new Exception("Race not found or not authorized to update.");

            race.Name = raceDto.Name;
            race.Date = raceDto.Date;
            race.Distance = raceDto.Distance;
            _context.Races.Update(race);
            await _context.SaveChangesAsync();
            return _mapper.Map<RaceDto>(race);
        }

        public async Task DeleteRaceAsync(int userId, int raceId)
        {
            var race = await _context.Races.FirstOrDefaultAsync(r => r.Id == raceId && r.UserId == userId);
            if (race == null) throw new Exception("Race not found or not authorized to delete.");

            _context.Races.Remove(race);
            await _context.SaveChangesAsync();
        }

        public async Task<RaceResultDto> AddRaceResultAsync(int currentUser, CreateRaceResultDto raceResultDto)
        {
            var result = _mapper.Map<RaceResult>(raceResultDto);
            result.UserId = currentUser;
            _context.RaceResults.Add(result);
            await _context.SaveChangesAsync();
            return _mapper.Map<RaceResultDto>(result);
        }
        
        public async Task RemoveRaceResultAsync(int currentUser, int raceId, int resultId)
        {
            var result = await _context.RaceResults
                .FirstOrDefaultAsync(r => r.Id == resultId && r.RaceId == raceId && r.UserId == currentUser);

            if (result == null) throw new Exception("Race result not found or not authorized to remove.");

            _context.RaceResults.Remove(result);
            await _context.SaveChangesAsync();
        }


        public async Task<List<RaceResultDto>> GetRaceResultsByPigeonIdAsync(int pigeonId)
        {
            var results = await _context.RaceResults
                .Where(r => r.PigeonId == pigeonId)
                .ToListAsync();
            return _mapper.Map<List<RaceResultDto>>(results);
        }

        public async Task<List<RaceResultDto>> GetRaceResultsByRaceIdAsync(int raceId)
        {
            var results = await _context.RaceResults
                .Include(x => x.Pigeon)
                .Where(r => r.RaceId == raceId)
                .ToListAsync();
            return _mapper.Map<List<RaceResultDto>>(results);
        }

        public async Task<List<BasketDto>> GetBasketsByRaceIdAsync(int currentUser, int raceId)
        {
            var baskets = await _context.Baskets
                .Include(x=>x.Pigeon)
                .Where(b => b.RaceId == raceId && b.UserId == currentUser)
                .ToListAsync();
            return _mapper.Map<List<BasketDto>>(baskets);
        }

        public async Task<BasketDto> AddPigeonToBasketAsync(int userId, BasketPigeonDto basketPigeonDto)
        {
            var basket = _mapper.Map<Basket>(basketPigeonDto);
            basket.UserId = userId;
            basket.BasketedAt = DateTime.Now;
            _context.Baskets.Add(basket);
            await _context.SaveChangesAsync();
            return _mapper.Map<BasketDto>(basket);
        }

        public async Task RemovePigeonFromBasketAsync(int currentUser, int basketId)
        {
            var basket = await _context.Baskets.FirstOrDefaultAsync(b => b.Id == basketId && b.UserId == currentUser);
            if (basket == null) throw new Exception("Basket entry not found or not authorized to remove.");

            _context.Baskets.Remove(basket);
            await _context.SaveChangesAsync();
        }

        public async Task<RaceDto> UpdateRaceStatusAsync(int currentUser, UpdateRaceStatusDto raceStatusDto)
        {
            var race = await _context.Races.FirstOrDefaultAsync(r => r.Id == raceStatusDto.RaceId && r.UserId == currentUser);
            if (race == null) throw new Exception("Race not found or not authorized to update status.");

            race.RaceStatusId = raceStatusDto.StatusId;
            await _context.SaveChangesAsync();
            return _mapper.Map<RaceDto>(race);
        }

        public async Task<List<RaceResultDto>> GetRaceLeaderBoardAsync(int userId, int raceId)
        {
            var results = await _context.RaceResults
                .Include(x => x.Pigeon)
                .Where(r => r.RaceId == raceId)
                .OrderBy(r => r.FinishTime)
                .ToListAsync();
            return _mapper.Map<List<RaceResultDto>>(results);
        }
    }
}
