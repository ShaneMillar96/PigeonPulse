using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Api.Controllers.Base;
using PigeonPulse.Api.Models.Request.Pigeon;
using PigeonPulse.Api.Models.View.Pagination;
using PigeonPulse.Api.Models.View.Pigeon;
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
        private readonly ILogger<PigeonController> _logger;

        public PigeonController(IPigeonPulseDbContext context, IPigeonService pigeonService, IMapper mapper, ILogger<PigeonController> logger)
            : base(context)
        {
            _pigeonService = pigeonService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetPigeons([FromQuery] PaginationDto pagination)
        {
            try
            {
                var userId = GetCurrentUserId();
                var pigeons = await _pigeonService.GetPigeonsByUserIdAsync(userId, pagination);
                return Ok(_mapper.Map<PaginatedViewModel<PigeonViewModel>>(pigeons));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting pigeons.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{pigeonId}")]
        public async Task<IActionResult> GetPigeonById(int pigeonId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var pigeon = await _pigeonService.GetPigeonByIdAsync(pigeonId, userId);
                if (pigeon == null) return NotFound("Pigeon not found.");

                return Ok(_mapper.Map<PigeonViewModel>(pigeon));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting pigeon by id.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreatePigeon([FromBody] CreatePigeonRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = GetCurrentUserId();
                var pigeonId = await _pigeonService.CreatePigeonAsync(userId, _mapper.Map<CreatePigeonDto>(request));
                return CreatedAtAction(nameof(GetPigeonById), new { pigeonId }, pigeonId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating pigeon.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{pigeonId}")]
        public async Task<IActionResult> UpdatePigeon(int pigeonId, [FromBody] UpdatePigeonRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = GetCurrentUserId();
                var updated = await _pigeonService.UpdatePigeonAsync(userId, pigeonId, _mapper.Map<UpdatePigeonDto>(request));
                if (updated) return Ok();
                return NotFound($"Pigeon with id {pigeonId} not found");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating pigeon.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{pigeonId}")]
        public async Task<IActionResult> DeletePigeon(int pigeonId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var deleted = await _pigeonService.DeletePigeonAsync(userId, pigeonId);
                if (deleted) return NoContent();
                return NotFound($"Pigeon with id {pigeonId} not found");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting pigeon.");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}