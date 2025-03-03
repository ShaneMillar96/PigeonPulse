using PigeonPulse.Services.Dtos.Race;

namespace PigeonPulse.Services.Interfaces;

public interface IRaceService
{
    Task<List<RaceDto>> GetAllRacesAsync(int currentUser);
    Task<RaceDto> GetRaceByIdAsync(int raceId);
    Task<RaceDto> CreateRaceAsync(int currentUser, CreateRaceDto raceDto);
    Task<RaceDto> UpdateRaceAsync(int currentUser, int raceId, UpdateRaceDto raceDto);
    Task DeleteRaceAsync(int currentUser, int raceId);
    Task<RaceResultDto> AddRaceResultAsync(int currentUser, CreateRaceResultDto raceResultDto);
    Task<List<RaceResultDto>> GetRaceResultsByPigeonIdAsync(int pigeonId);
    Task<List<RaceResultDto>> GetRaceResultsByRaceIdAsync(int raceId);
    Task<List<BasketDto>> GetBasketsByRaceIdAsync(int currentUser, int raceId);
    Task<BasketDto> AddPigeonToBasketAsync(int userId, BasketPigeonDto basketPigeonDto);
    Task RemovePigeonFromBasketAsync(int currentUser, int basketId);
    Task<RaceDto> UpdateRaceStatusAsync(int currentUser, UpdateRaceStatusDto raceStatusDto);
    Task<List<RaceResultDto>> GetRaceLeaderBoardAsync(int userId, int raceId);
}