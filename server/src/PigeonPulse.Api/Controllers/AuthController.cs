using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Services.Dtos.Account;
using PigeonPulse.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using PigeonPulse.Api.Models.Request.Account;
using System.ComponentModel.DataAnnotations;

namespace PigeonPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public AuthController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody, Required] RegisterUserRequestModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _userService.RegisterAsync(_mapper.Map<RegisterDto>(request));
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody, Required] LoginUserRequestModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var token = await _userService.LoginAsync(_mapper.Map<LoginDto>(request));
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return Unauthorized("Invalid credentials");
            }
        }
    }
}