using PigeonPulse.Services.Dtos;
using PigeonPulse.Services.Dtos.Pigeon;

namespace PigeonPulse.Services.Interfaces;

public interface IPigeonService
{
    Task<PigeonDto> CreatePigeonAsync(int userId, CreatePigeonDto pigeon);
    Task<List<PigeonDto>> GetPigeonsByUserIdAsync(int userId);
    Task<PigeonDto?> GetPigeonByIdAsync(int pigeonId, int userId);
    Task<PigeonDto> UpdatePigeonAsync(int userId, int pigeonId, UpdatePigeonDto pigeon);
    Task DeletePigeonAsync(int userId, int pigeonId);
}