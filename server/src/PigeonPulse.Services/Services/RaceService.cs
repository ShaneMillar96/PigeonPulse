using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Enums;
using PigeonPulse.Dal.Interfaces;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Services.Dtos.Leaderboard;
using PigeonPulse.Services.Dtos.Race;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Services.Services
{
    public class RaceService : IRaceService
    {
        private readonly IPigeonPulseDbContext _context;
        private readonly IMapper _mapper;

        public RaceService(IPigeonPulseDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<RaceDto>> GetAllRacesAsync(int currentUser)
        {
            var races = await _context.Get<Race>()
                .Include(x => x.RaceStatus)
                .Where(r => r.UserId == currentUser)
                .ToListAsync();
            return _mapper.Map<List<RaceDto>>(races);
        }

        public async Task<RaceDto> GetRaceByIdAsync(int raceId)
        {
            var race = await _context.Get<Race>().FirstOrDefaultAsync(r => r.Id == raceId);
            return _mapper.Map<RaceDto>(race);
        }

        public async Task<int> CreateRaceAsync(int userId, CreateRaceDto raceDto)
        {
            var newRace = _mapper.Map<Race>(raceDto);
            newRace.UserId = userId;
            newRace.RaceStatusId = (int)RaceStatusEnum.New;
            await _context.AddAsync(newRace);
            await _context.SaveChangesAsync();
            return newRace.Id;
        }

        public async Task<bool> UpdateRaceAsync(int userId, int raceId, UpdateRaceDto raceDto)
        {
            var currentRace = await _context.Get<Race>().FirstOrDefaultAsync(r => r.Id == raceId && r.UserId == userId);
            if (currentRace == null) return false;

            _mapper.Map(raceDto, currentRace);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteRaceAsync(int userId, int raceId)
        {
            var race = await _context.Get<Race>().FirstOrDefaultAsync(r => r.Id == raceId && r.UserId == userId);
            if (race == null) return false;

            _context.Delete(race);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<RaceResultDto> AddRaceResultAsync(int currentUser, CreateRaceResultDto raceResultDto)
        {
            var result = _mapper.Map<RaceResult>(raceResultDto);
            result.UserId = currentUser;
            await _context.AddAsync(result);
            await _context.SaveChangesAsync();
            return _mapper.Map<RaceResultDto>(result);
        }
        
        public async Task<bool> RemoveRaceResultAsync(int currentUser, int raceId, int resultId)
        {
            var result = await _context.Get<RaceResult>()
                .FirstOrDefaultAsync(r => r.Id == resultId && r.RaceId == raceId && r.UserId == currentUser);

            if (result == null) return false;

            _context.Delete(result);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<List<RaceResultDto>> GetRaceResultsByPigeonIdAsync(int pigeonId)
        {
            var results = await _context.Get<RaceResult>()
                .Where(r => r.PigeonId == pigeonId)
                .ToListAsync();
            return _mapper.Map<List<RaceResultDto>>(results);
        }

        public async Task<List<RaceResultDto>> GetRaceResultsByRaceIdAsync(int raceId)
        {
            var results = await _context.Get<RaceResult>()
                .Include(x => x.Pigeon)
                .Where(r => r.RaceId == raceId)
                .ToListAsync();
            return _mapper.Map<List<RaceResultDto>>(results);
        }

        public async Task<List<BasketDto>> GetBasketsByRaceIdAsync(int currentUser, int raceId)
        {
            var baskets = await _context.Get<Basket>()
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
            await _context.AddAsync(basket);
            await _context.SaveChangesAsync();
            return _mapper.Map<BasketDto>(basket);
        }

        public async Task RemovePigeonFromBasketAsync(int currentUser, int basketId)
        {
            var basket = await _context.Get<Basket>().FirstOrDefaultAsync(b => b.Id == basketId && b.UserId == currentUser);
            if (basket == null) throw new Exception("Basket entry not found or not authorized to remove.");

            _context.Delete(basket);
            await _context.SaveChangesAsync();
        }

        public async Task<RaceDto> UpdateRaceStatusAsync(int currentUser, UpdateRaceStatusDto raceStatusDto)
        {
            var race = await _context.Get<Race>().FirstOrDefaultAsync(r => r.Id == raceStatusDto.RaceId && r.UserId == currentUser);
            if (race == null) throw new Exception("Race not found or not authorized to update status.");

            race.RaceStatusId = raceStatusDto.StatusId;
            await _context.SaveChangesAsync();
            return _mapper.Map<RaceDto>(race);
        }

        public async Task<LeaderboardDto> GetRaceLeaderBoardAsync(int userId, int raceId)
        {
            var race = await _context.Get<Race>()
                .Include(r => r.RaceResults)
                .ThenInclude(rr => rr.Pigeon)
                .FirstOrDefaultAsync(r => r.Id == raceId);
    
            if (race == null) throw new Exception("Race not found.");

            var leaderboardDto = _mapper.Map<LeaderboardDto>(race);

            leaderboardDto.Results = leaderboardDto.Results
                .OrderBy(r => r.TimeRecorded)
                .ToList();

            return leaderboardDto;
        }
    }
}
