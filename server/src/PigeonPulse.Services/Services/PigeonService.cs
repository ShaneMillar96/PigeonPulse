using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Dal.Interfaces;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Dal.Specifications.Pigeons;
using PigeonPulse.Services.Dtos.Pagination;
using PigeonPulse.Services.Dtos.Pigeon;
using PigeonPulse.Services.Interfaces;
using Unosquare.EntityFramework.Specification.Common.Extensions;

namespace PigeonPulse.Services.Services
{
    public class PigeonService : IPigeonService
    {
        private readonly IPigeonPulseDbContext _context;
        private readonly IMapper _mapper;
        private readonly IPaginationService _paginationService;


        public PigeonService(IPigeonPulseDbContext context, IPaginationService paginationService, IMapper mapper)
        {
            _context = context;
            _paginationService = paginationService;
            _mapper = mapper;
        }

        public async Task<PigeonDto> CreatePigeonAsync(int userId, CreatePigeonDto pigeonDto)
        {
            if (await _context.Get<Pigeon>().AnyAsync(p => p.RingNumber == pigeonDto.RingNumber))
                throw new Exception("Pigeon with this ring number already exists.");

            var pigeon = _mapper.Map<Pigeon>(pigeonDto);
            pigeon.UserId = userId;
            await _context.AddAsync(pigeon);
            await _context.SaveChangesAsync();
            return _mapper.Map<PigeonDto>(pigeon);
        }

        public async Task<PaginatedDto<PigeonDto>> GetPigeonsByUserIdAsync(int userId, PaginationDto pagination)
        {
            var (pageSize, pageNumber, searchQuery, sortBy, ascending) = pagination;
            
            var query = _context
                .Get<Pigeon>()
                .Where(new PigeonBySearchSpec(searchQuery).And(new PigeonByUserIdSpec(userId)));
            
            var pigeons = _mapper
                .ProjectTo<PigeonDto>(query)
                .OrderByDescending(x => x.CreatedDate);
            
            return await _paginationService.CreatePaginatedResponseAsync(pigeons, pageSize, pageNumber);
        }

        public async Task<PigeonDto?> GetPigeonByIdAsync(int pigeonId, int userId)
        {
            var pigeon = await _context.Get<Pigeon>().FirstOrDefaultAsync(p => p.Id == pigeonId && p.UserId == userId);
            return pigeon == null ? null : _mapper.Map<PigeonDto>(pigeon);
        }

        public async Task<PigeonDto> UpdatePigeonAsync(int userId, int pigeonId, UpdatePigeonDto pigeonDto)
        {
            var pigeon = await _context.Get<Pigeon>().FirstOrDefaultAsync(p => p.Id == pigeonId && p.UserId == userId);
            if (pigeon == null) throw new Exception("Pigeon not found.");

            pigeon.Name = pigeonDto.Name;
            pigeon.Color = pigeonDto.Color;
            pigeon.Strain = pigeonDto.Strain;
            await _context.SaveChangesAsync();
            return _mapper.Map<PigeonDto>(pigeon);
        }

        public async Task DeletePigeonAsync(int userId, int pigeonId)
        {
            var pigeon = await _context.Get<Pigeon>().FirstOrDefaultAsync(p => p.Id == pigeonId && p.UserId == userId);
            if (pigeon == null) throw new Exception("Pigeon not found.");

            _context.Delete(pigeon);
            await _context.SaveChangesAsync();
        }
    }
}
