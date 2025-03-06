using PigeonPulse.Services.Dtos.Leaderboard;
using PigeonPulse.Services.Dtos.Race;

namespace PigeonPulse.Services.Interfaces;

public interface IRaceService
{
    Task<List<RaceDto>> GetAllRacesAsync(int currentUser);
    Task<RaceDto> GetRaceByIdAsync(int raceId);
    Task<int> CreateRaceAsync(int currentUser, CreateRaceDto raceDto);
    Task<bool> UpdateRaceAsync(int currentUser, int raceId, UpdateRaceDto raceDto);
    Task<bool> DeleteRaceAsync(int currentUser, int raceId);
    Task<RaceResultDto> AddRaceResultAsync(int currentUser, CreateRaceResultDto raceResultDto);
    Task<bool> RemoveRaceResultAsync(int currentUser, int raceId, int resultId);
    Task<List<RaceResultDto>> GetRaceResultsByPigeonIdAsync(int pigeonId);
    Task<List<RaceResultDto>> GetRaceResultsByRaceIdAsync(int raceId);
    Task<List<BasketDto>> GetBasketsByRaceIdAsync(int currentUser, int raceId);
    Task<BasketDto> AddPigeonToBasketAsync(int userId, BasketPigeonDto basketPigeonDto);
    Task<bool> RemovePigeonFromBasketAsync(int currentUser, int basketId);
    Task<RaceDto> UpdateRaceStatusAsync(int currentUser, UpdateRaceStatusDto raceStatusDto);
    Task<LeaderboardDto> GetRaceLeaderBoardAsync(int userId, int raceId);
}