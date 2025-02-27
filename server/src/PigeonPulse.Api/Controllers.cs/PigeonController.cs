using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Api.Models.Request;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PigeonController : ControllerBase
    {
        private readonly IPigeonService _pigeonService;

        public PigeonController(IPigeonService pigeonService)
        {
            _pigeonService = pigeonService;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePigeon(int userId, [FromBody] PigeonRequest request)
        {
            var pigeon = await _pigeonService.CreatePigeonAsync(userId, request.Name, request.RingNumber);
            return Ok(pigeon);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetPigeonsByUserId(int userId)
        {
            var pigeons = await _pigeonService.GetPigeonsByUserIdAsync(userId);
            return Ok(pigeons);
        }
    }
}