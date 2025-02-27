using PigeonPulse.Services.Dtos;

namespace PigeonPulse.Services.Interfaces;

public interface IRaceService
{
    Task<RaceDto> CreateRaceAsync(string name, DateTime date, decimal distance, string weatherConditions);
    Task<RaceResultDto> AddRaceResultAsync(int pigeonId, int raceId, DateTime finishTime, decimal speed);
    Task<List<RaceResultDto>> GetRaceResultsByPigeonIdAsync(int pigeonId);
}