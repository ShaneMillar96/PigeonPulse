using PigeonPulse.Services.Dtos;

namespace PigeonPulse.Services.Interfaces;

public interface IPigeonService
{
    Task<PigeonDto> CreatePigeonAsync(int userId, string name, string ringNumber);
    Task<List<PigeonDto>> GetPigeonsByUserIdAsync(int userId);
}