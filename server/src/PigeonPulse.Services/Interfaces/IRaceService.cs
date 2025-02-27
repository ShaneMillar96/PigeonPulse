using PigeonPulse.Services.Dtos;
using PigeonPulse.Services.Dtos.Race;

namespace PigeonPulse.Services.Interfaces;

public interface IRaceService
{
    Task<RaceDto> CreateRaceAsync(CreateRaceDto race);
    Task<RaceResultDto> AddRaceResultAsync(CreateRaceResultDto raceResult);
    Task<List<RaceResultDto>> GetRaceResultsByPigeonIdAsync(int pigeonId);
}