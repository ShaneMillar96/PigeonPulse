using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Api.Models.Request;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = await _userService.RegisterAsync(request.Username, request.Email, request.Password);
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userService.LoginAsync(request.Email, request.Password);
            return Ok(user);
        }
    }
}