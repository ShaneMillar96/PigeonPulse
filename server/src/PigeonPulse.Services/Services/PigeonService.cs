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

        public async Task<int> CreatePigeonAsync(int userId, CreatePigeonDto pigeonDto)
        {
            if (await _context.Get<Pigeon>().AnyAsync(p => p.RingNumber == pigeonDto.RingNumber))
                throw new Exception("Pigeon with this ring number already exists.");

            var newPigeon = _mapper.Map<Pigeon>(pigeonDto);
            newPigeon.UserId = userId;
            await _context.AddAsync(newPigeon);
            await _context.SaveChangesAsync();
            return newPigeon.Id;
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

        public async Task<bool> UpdatePigeonAsync(int userId, int pigeonId, UpdatePigeonDto pigeonDto)
        {
            var currentPigeon = await _context.Get<Pigeon>().FirstOrDefaultAsync(p => p.Id == pigeonId && p.UserId == userId);
            if (currentPigeon == null) return false;
            
            _mapper.Map(pigeonDto, currentPigeon);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePigeonAsync(int userId, int pigeonId)
        {
            var pigeon = await _context.Get<Pigeon>().FirstOrDefaultAsync(p => p.Id == pigeonId && p.UserId == userId);
            if (pigeon == null) return false;

            _context.Delete(pigeon);
            await _context.SaveChangesAsync();
            return true;
        }
        
        public async Task<int> CreatePairedPigeonAsync(int userId, CreatePairedPigeonDto createPairedPigeonDto)
        {
            
            var newPigeon = _mapper.Map<Pigeon>(createPairedPigeonDto);
            newPigeon.UserId = userId;

            await _context.AddAsync(newPigeon);
            await _context.SaveChangesAsync();
            return newPigeon.Id;
        }
        
        public async Task<PedigreeDto?> GetPedigreeTreeAsync(int pigeonId, int userId, int generations = 4)
        {
            var pigeon = await _context.Get<Pigeon>()
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == pigeonId && p.UserId == userId);

            return pigeon == null ? null : await BuildPedigreeAsync(pigeon, generations);
        }

        private async Task<PedigreeDto?> BuildPedigreeAsync(Pigeon pigeon, int generationsLeft)
        {
            if (pigeon == null || generationsLeft == 0) return null;

            var dto = new PedigreeDto
            {
                PigeonId = pigeon.Id,
                RingNumber = pigeon.RingNumber,
                Color = pigeon.Color,
                Sex = pigeon.Sex
            };

            if (pigeon.Fatherid.HasValue)
            {
                var father = await _context.Get<Pigeon>().AsNoTracking().FirstOrDefaultAsync(p => p.Id == pigeon.Fatherid.Value);
                dto.Father = await BuildPedigreeAsync(father, generationsLeft - 1);
            }

            if (pigeon.Motherid.HasValue)
            {
                var mother = await _context.Get<Pigeon>().AsNoTracking().FirstOrDefaultAsync(p => p.Id == pigeon.Motherid.Value);
                dto.Mother = await BuildPedigreeAsync(mother, generationsLeft - 1);
            }

            return dto;
        }


    }
}
