using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Services.Dtos;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Services.Services
{
    public class UserService : IUserService
    {
        private readonly PigeonPulseDbContext _context;
        private readonly IMapper _mapper;

        public UserService(PigeonPulseDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<UserDto> RegisterAsync(string username, string email, string password)
        {
            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                CreatedDate = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> LoginAsync(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                throw new Exception("Invalid credentials");
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user == null ? null : _mapper.Map<UserDto>(user);
        }
    }
}