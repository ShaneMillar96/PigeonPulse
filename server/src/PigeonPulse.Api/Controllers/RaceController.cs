using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Api.Controllers.Base;
using PigeonPulse.Api.Models.Request;
using PigeonPulse.Api.Models.View;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Services.Dtos.Race;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RaceController : PigeonPulseBaseController
    {
        private readonly IMapper _mapper;
        private readonly IRaceService _raceService;

        public RaceController(PigeonPulseDbContext context, IRaceService raceService, IMapper mapper)  : base(context)
        {
            _raceService = raceService;
            _mapper = mapper;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetRaces()
        {
            var races = await _raceService.GetAllRacesAsync();
            return Ok(_mapper.Map<List<RaceViewModel>>(races));
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
        
        [HttpPost("basket")]
        public async Task<IActionResult> BasketPigeon([FromBody] BasketRequest request)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == 0) return Unauthorized();
            var basket = await _raceService.BasketPigeonAsync(currentUserId, _mapper.Map<BasketPigeonDto>(request));
            return Ok(basket);
        }

        [HttpGet("{raceId}/baskets")]
        public async Task<IActionResult> GetBasketsByRaceId(int raceId)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == 0) return Unauthorized();
            var baskets = await _raceService.GetBasketsByRaceIdAsync(raceId);
            return Ok(baskets);
        }
    }
}