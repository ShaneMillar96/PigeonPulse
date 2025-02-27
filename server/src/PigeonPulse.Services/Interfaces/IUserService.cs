using PigeonPulse.Services.Dtos;

namespace PigeonPulse.Services.Interfaces;

public interface IUserService
{
    Task<UserDto> RegisterAsync(string username, string email, string password);
    Task<UserDto> LoginAsync(string email, string password);
    Task<UserDto> GetUserByIdAsync(int id);
}