using PigeonPulse.Services.Dtos.Account;
using PigeonPulse.Services.Dtos.User;

namespace PigeonPulse.Services.Interfaces;

public interface IUserService
{
    Task<UserDto> RegisterAsync(RegisterDto user);
    Task<UserDto> LoginAsync(LoginDto user);
    Task<UserDto?> GetUserByIdAsync(int id);
}