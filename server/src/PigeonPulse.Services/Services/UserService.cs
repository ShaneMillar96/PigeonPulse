using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PigeonPulse.Dal.Interfaces;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Services.Dtos.Account;
using PigeonPulse.Services.Dtos.User;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Services.Services
{
    public class UserService : IUserService
    {
        private readonly IPigeonPulseDbContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;


        public UserService(IPigeonPulseDbContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;

        }

        public async Task<UserDto> RegisterAsync(RegisterDto registerDto)
        {
            var user = _mapper.Map<User>(registerDto);
      
            await _context.AddAsync(user);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserDto>(user);
        }

        public async Task<string?> LoginAsync(LoginDto userDto)
        {
            var user = await _context.Get<User>().FirstOrDefaultAsync(u => u.Email == userDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash))
                throw new Exception("Invalid credentials");
            
            return GenerateJwtToken(_mapper.Map<UserDto>(user));
        }

        private string GenerateJwtToken(UserDto user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(int.Parse(jwtSettings["ExpiryInMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}