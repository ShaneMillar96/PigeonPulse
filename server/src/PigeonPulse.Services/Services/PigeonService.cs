using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Dal.Models.application;
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
            if (await _context.Pigeons.AnyAsync(p => p.RingNumber == pigeonDto.RingNumber))
                throw new Exception("Pigeon with this ring number already exists.");

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

        public async Task<PigeonDto?> GetPigeonByIdAsync(int pigeonId, int userId)
        {
            var pigeon = await _context.Pigeons.FirstOrDefaultAsync(p => p.Id == pigeonId && p.UserId == userId);
            return pigeon == null ? null : _mapper.Map<PigeonDto>(pigeon);
        }

        public async Task<PigeonDto> UpdatePigeonAsync(int userId, int pigeonId, UpdatePigeonDto pigeonDto)
        {
            var pigeon = await _context.Pigeons.FirstOrDefaultAsync(p => p.Id == pigeonId && p.UserId == userId);
            if (pigeon == null) throw new Exception("Pigeon not found.");

            pigeon.Name = pigeonDto.Name;
            pigeon.Color = pigeonDto.Color;
            pigeon.Strain = pigeonDto.Strain;
            _context.Pigeons.Update(pigeon);
            await _context.SaveChangesAsync();
            return _mapper.Map<PigeonDto>(pigeon);
        }

        public async Task DeletePigeonAsync(int userId, int pigeonId)
        {
            var pigeon = await _context.Pigeons.FirstOrDefaultAsync(p => p.Id == pigeonId && p.UserId == userId);
            if (pigeon == null) throw new Exception("Pigeon not found.");

            _context.Pigeons.Remove(pigeon);
            await _context.SaveChangesAsync();
        }
    }
}
