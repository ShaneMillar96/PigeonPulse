using PigeonPulse.Services.Dtos.Race;

namespace PigeonPulse.Services.Interfaces;

public interface IRaceService
{
    public Task<List<RaceDto>> GetAllRacesAsync(int currentUser);
    Task<RaceDto> CreateRaceAsync(int currentUser, CreateRaceDto raceDto);
    Task<RaceResultDto> AddRaceResultAsync(int currentUser, CreateRaceResultDto raceResultDto);
    // Task<List<RaceResultDto>> GetRaceResultsByPigeonIdAsync(int pigeonId);
    // Task<List<RaceResultDto>> GetRaceResultsByRaceIdAsync(int raceId); 
    public Task<List<BasketDto>> GetBasketsByRaceIdAsync(int currentUser, int raceId);
    public Task<BasketDto> AddPigeonToBasketAsync(int userId, BasketPigeonDto basketPigeonDto);
    public Task RemovePigeonFromBasketAsync(int currentUser, int basketId);
    // public Task SaveBasketAsync(int raceId);
    public Task<RaceDto> UpdateRaceStatusAsync(int currentUser, int raceId, string statusName);
    Task<List<RaceResultDto>> GetRaceLeaderBoardAsync(int userId, int raceId);
}