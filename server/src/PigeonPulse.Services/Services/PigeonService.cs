using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Services.Dtos;
using PigeonPulse.Services.Dtos.Pigeon;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Services.Services
{
    public class PigeonService : IPigeonService
    {
        private readonly PigeonPulseDbContext _context;
        private readonly IMapper _mapper;

        public PigeonService(PigeonPulseDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PigeonDto> CreatePigeonAsync(int userId, CreatePigeonDto pigeonDto)
        {
            var pigeon = _mapper.Map<Pigeon>(pigeonDto);
            pigeon.UserId = userId;
            _context.Pigeons.Add(pigeon);
            await _context.SaveChangesAsync();
            return _mapper.Map<PigeonDto>(pigeon);
        }

        public async Task<List<PigeonDto>> GetPigeonsByUserIdAsync(int userId)
        {
            var pigeons = await _context.Pigeons.Where(p => p.UserId == userId).ToListAsync();
            return _mapper.Map<List<PigeonDto>>(pigeons);
        }
    }
}