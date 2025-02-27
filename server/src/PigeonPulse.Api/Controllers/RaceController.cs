using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Api.Models.Request;
using PigeonPulse.Api.Models.View;
using PigeonPulse.Services.Dtos.Race;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RaceController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IRaceService _raceService;

        public RaceController(IRaceService raceService, IMapper mapper)
        {
            _raceService = raceService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRace([FromBody] RaceRequest request)
        {
            var race = await _raceService.CreateRaceAsync(_mapper.Map<CreateRaceDto>(request));
            return Ok(_mapper.Map<RaceViewModel>(race));
        }

        [HttpPost("result")]
        public async Task<IActionResult> AddRaceResult([FromBody] RaceResultRequest request)
        {
            var result = await _raceService.AddRaceResultAsync(_mapper.Map<CreateRaceResultDto>(request));
            return Ok(_mapper.Map<RaceResultViewModel>(result));
        }

        [HttpGet("pigeon/{pigeonId}")]
        public async Task<IActionResult> GetRaceResultsByPigeonId(int pigeonId)
        {
            var results = await _raceService.GetRaceResultsByPigeonIdAsync(pigeonId);
            return Ok(_mapper.Map<List<RaceResultViewModel>>(results));
        }
    }
}