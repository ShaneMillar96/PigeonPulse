using PigeonPulse.Services.Dtos;
using PigeonPulse.Services.Dtos.Pigeon;

namespace PigeonPulse.Services.Interfaces;

public interface IPigeonService
{
    Task<PigeonDto> CreatePigeonAsync(int userId, CreatePigeonDto pigeon);
    Task<List<PigeonDto>> GetPigeonsByUserIdAsync(int userId);
}