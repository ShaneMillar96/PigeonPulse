using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Api.Models.Request;
using PigeonPulse.Api.Models.View;
using PigeonPulse.Services.Dtos.Pigeon;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PigeonController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IPigeonService _pigeonService;

        public PigeonController(IPigeonService pigeonService, IMapper mapper)
        {
            _pigeonService = pigeonService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePigeon(int userId, [FromBody] PigeonRequest request)
        {
            var pigeon = await _pigeonService.CreatePigeonAsync(userId, _mapper.Map<CreatePigeonDto>(request));
            return Ok(_mapper.Map<PigeonViewModel>(pigeon));
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetPigeonsByUserId(int userId)
        {
            var pigeons = await _pigeonService.GetPigeonsByUserIdAsync(userId);
            return Ok(_mapper.Map<List<PigeonViewModel>>(pigeons));
        }
    }
}