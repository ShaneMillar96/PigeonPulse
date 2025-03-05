using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Api.Controllers.Base;
using PigeonPulse.Api.Models.Request.Pigeon;
using PigeonPulse.Dal.Interfaces;
using PigeonPulse.Services.Dtos.Pagination;
using PigeonPulse.Services.Dtos.Pigeon;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PigeonController : PigeonPulseBaseController
    {
        private readonly IMapper _mapper;
        private readonly IPigeonService _pigeonService;

        public PigeonController(IPigeonPulseDbContext context, IPigeonService pigeonService, IMapper mapper)
            : base(context)
        {
            _pigeonService = pigeonService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetPigeons([FromQuery] PaginationDto pagination)
        {
            var userId = GetCurrentUserId();
            var pigeons = await _pigeonService.GetPigeonsByUserIdAsync(userId, pagination);
            return Ok(pigeons);
        }

        [HttpGet("{pigeonId}")]
        public async Task<IActionResult> GetPigeonById(int pigeonId)
        {
            var userId = GetCurrentUserId();
            var pigeon = await _pigeonService.GetPigeonByIdAsync(pigeonId, userId);
            if (pigeon == null) return NotFound("Pigeon not found.");
            return Ok(pigeon);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePigeon([FromBody] CreatePigeonRequest request)
        {
            var userId = GetCurrentUserId();
            var pigeon = await _pigeonService.CreatePigeonAsync(userId, _mapper.Map<CreatePigeonDto>(request));
            return CreatedAtAction(nameof(GetPigeonById), new { pigeonId = pigeon.Id }, pigeon);
        }

        [HttpPut("{pigeonId}")]
        public async Task<IActionResult> UpdatePigeon(int pigeonId, [FromBody] UpdatePigeonRequest request)
        {
            var userId = GetCurrentUserId();
            var updatedPigeon = await _pigeonService.UpdatePigeonAsync(userId, pigeonId, _mapper.Map<UpdatePigeonDto>(request));
            return Ok(updatedPigeon);
        }

        [HttpDelete("{pigeonId}")]
        public async Task<IActionResult> DeletePigeon(int pigeonId)
        {
            var userId = GetCurrentUserId();
            await _pigeonService.DeletePigeonAsync(userId, pigeonId);
            return NoContent();
        }
    }
}
