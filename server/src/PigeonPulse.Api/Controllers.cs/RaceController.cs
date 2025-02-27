using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Api.Models.Request;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RaceController : ControllerBase
    {
        private readonly IRaceService _raceService;

        public RaceController(IRaceService raceService)
        {
            _raceService = raceService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRace([FromBody] RaceRequest request)
        {
            var race = await _raceService.CreateRaceAsync(request.Name, request.Date, request.Distance, request.WeatherConditions);
            return Ok(race);
        }

        [HttpPost("result")]
        public async Task<IActionResult> AddRaceResult([FromBody] RaceResultRequest request)
        {
            var result = await _raceService.AddRaceResultAsync(request.PigeonId, request.RaceId, request.FinishTime, request.Speed);
            return Ok(result);
        }

        [HttpGet("pigeon/{pigeonId}")]
        public async Task<IActionResult> GetRaceResultsByPigeonId(int pigeonId)
        {
            var results = await _raceService.GetRaceResultsByPigeonIdAsync(pigeonId);
            return Ok(results);
        }
    }
}