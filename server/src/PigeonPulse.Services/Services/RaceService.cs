using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Services.Dtos;
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

        public async Task<RaceDto> CreateRaceAsync(string name, DateTime date, decimal distance, string weatherConditions)
        {
            var race = new Race
            {
                Name = name,
                Date = date,
                Distance = distance,
                WeatherConditions = weatherConditions,
                CreatedDate = DateTime.UtcNow
            };
            _context.Races.Add(race);
            await _context.SaveChangesAsync();
            return _mapper.Map<RaceDto>(race);
        }

        public async Task<RaceResultDto> AddRaceResultAsync(int pigeonId, int raceId, DateTime finishTime, decimal speed)
        {
            var result = new Raceresult
            {
                PigeonId = pigeonId,
                RaceId = raceId,
                FinishTime = finishTime,
                Speed = speed,
                CreatedDate = DateTime.UtcNow
            };
            _context.RaceResults.Add(result);
            await _context.SaveChangesAsync();
            return _mapper.Map<RaceResultDto>(result);
        }

        public async Task<List<RaceResultDto>> GetRaceResultsByPigeonIdAsync(int pigeonId)
        {
            var results = await _context.RaceResults.Where(r => r.PigeonId == pigeonId).ToListAsync();
            return _mapper.Map<List<RaceResultDto>>(results);
        }
    }
}