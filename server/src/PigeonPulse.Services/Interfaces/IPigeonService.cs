using PigeonPulse.Services.Dtos.Pagination;
using PigeonPulse.Services.Dtos.Pigeon;

namespace PigeonPulse.Services.Interfaces;

public interface IPigeonService
{
    Task<PaginatedDto<PigeonDto>> GetPigeonsByUserIdAsync(int userId, PaginationDto pagination);
    Task<PigeonDto> CreatePigeonAsync(int userId, CreatePigeonDto pigeonDto);
    Task<PigeonDto?> GetPigeonByIdAsync(int pigeonId, int userId);
    Task<PigeonDto> UpdatePigeonAsync(int userId, int pigeonId, UpdatePigeonDto pigeon);
    Task DeletePigeonAsync(int userId, int pigeonId);
}