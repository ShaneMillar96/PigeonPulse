using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Api.Controllers.Base;
using PigeonPulse.Api.Models.Request.Race;
using PigeonPulse.Api.Models.View;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Services.Dtos.Race;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class RaceController : PigeonPulseBaseController
{
    private readonly IRaceService _raceService;
    private readonly IMapper _mapper;

    public RaceController(PigeonPulseDbContext context, IRaceService raceService, IMapper mapper)
        : base(context)
    {
        _raceService = raceService;
        _mapper = mapper;
    }
    
    
    [HttpGet]
    public async Task<ActionResult<List<RaceViewModel>>> GetRaces()
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0) return Unauthorized();
        var races = await _raceService.GetAllRacesAsync(currentUserId);
        return Ok(_mapper.Map<List<RaceViewModel>>(races));
    }

    [HttpPost]
    public async Task<IActionResult> CreateRace([FromBody] CreateRaceRequest request)
    {
        var userId = GetCurrentUserId();
        var race = await _raceService.CreateRaceAsync(userId, _mapper.Map<CreateRaceDto>(request));
        return CreatedAtAction(nameof(GetRaceById), new { raceId = race.Id }, race);
    }

    [HttpGet("{raceId}")]
    public async Task<IActionResult> GetRaceById(int raceId)
    {
        var race = await _raceService.GetRaceByIdAsync(raceId);
        return Ok(race);
    }

    [HttpPut("{raceId}")]
    public async Task<IActionResult> UpdateRace(int raceId, [FromBody] UpdateRaceRequest request)
    {
        var userId = GetCurrentUserId();
        var race = await _raceService.UpdateRaceAsync(userId, raceId, _mapper.Map<UpdateRaceDto>(request));
        return Ok(race);
    }

    [HttpDelete("{raceId}")]
    public async Task<IActionResult> DeleteRace(int raceId)
    {
        var userId = GetCurrentUserId();
        await _raceService.DeleteRaceAsync(userId, raceId);
        return NoContent();
    }

    [HttpPost("{raceId}/results")]
    public async Task<IActionResult> AddRaceResult([FromBody] CreateRaceResultRequest request)
    {
        if (request.TimeRecorded == default)
        {
            return BadRequest("TimeRecorded must be in HH:mm:ss format.");
        }
        var userId = GetCurrentUserId();
        var result = await _raceService.AddRaceResultAsync(userId, _mapper.Map<CreateRaceResultDto>(request));
        return Ok(result);
    }
    
    [HttpDelete("{raceId}/results/{resultId}")]
    public async Task<IActionResult> RemoveRaceResult(int raceId, int resultId)
    {
        var userId = GetCurrentUserId();
        await _raceService.RemoveRaceResultAsync(userId, raceId, resultId);
        return NoContent();
    }


    [HttpGet("{raceId}/results")]
    public async Task<IActionResult> GetRaceResults(int raceId)
    {
        var results = await _raceService.GetRaceResultsByRaceIdAsync(raceId);
        return Ok(results);
    }

    [HttpGet("pigeon/{pigeonId}/results")]
    public async Task<IActionResult> GetPigeonRaceResults(int pigeonId)
    {
        var results = await _raceService.GetRaceResultsByPigeonIdAsync(pigeonId);
        return Ok(results);
    }

    [HttpGet("{raceId}/baskets")]
    public async Task<IActionResult> GetBasketsByRaceId(int raceId)
    {
        var userId = GetCurrentUserId();
        var baskets = await _raceService.GetBasketsByRaceIdAsync(userId, raceId);
        return Ok(baskets);
    }

    [HttpPost("{raceId}/baskets")]
    public async Task<IActionResult> AddPigeonToBasket([FromBody] BasketPigeonDto basketPigeonDto)
    {
        var userId = GetCurrentUserId();
        var basket = await _raceService.AddPigeonToBasketAsync(userId, basketPigeonDto);
        return Ok(basket);
    }

    [HttpDelete("baskets/{basketId}")]
    public async Task<IActionResult> RemovePigeonFromBasket(int basketId)
    {
        var userId = GetCurrentUserId();
        await _raceService.RemovePigeonFromBasketAsync(userId, basketId);
        return NoContent();
    }

    [HttpPut("{raceId}/status")]
    public async Task<IActionResult> UpdateRaceStatus([FromBody] UpdateRaceStatusDto raceStatusDto)
    {
        var userId = GetCurrentUserId();
        var race = await _raceService.UpdateRaceStatusAsync(userId, raceStatusDto);
        return Ok(race);
    }

    [HttpGet("{raceId}/leaderboard")]
    public async Task<IActionResult> GetRaceLeaderBoard(int raceId)
    {
        var userId = GetCurrentUserId();
        var leaderboard = await _raceService.GetRaceLeaderBoardAsync(userId, raceId);
        return Ok(leaderboard);
    }
}
