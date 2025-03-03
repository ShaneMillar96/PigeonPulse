using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Api.Controllers.Base;
using PigeonPulse.Api.Models.Request;
using PigeonPulse.Api.Models.View;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Dal.Models.application;
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
    public async Task<ActionResult<RaceViewModel>> CreateRace(RaceRequest raceRequest)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0) return Unauthorized();
        var raceDto = _mapper.Map<CreateRaceDto>(raceRequest);
        var race = await _raceService.CreateRaceAsync(currentUserId, raceDto);
        return Ok(_mapper.Map<RaceViewModel>(race));
    }

    [HttpPost("result")]
    public async Task<ActionResult<RaceResultViewModel>> AddRaceResult(RaceResultRequest raceResultRequest)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0) return Unauthorized();
        var raceResultDto = _mapper.Map<CreateRaceResultDto>(raceResultRequest);
        var raceResult = await _raceService.AddRaceResultAsync(currentUserId, raceResultDto);
        return Ok(_mapper.Map<RaceResultViewModel>(raceResult));
    }

    [HttpGet("{raceId}/baskets")]
    public async Task<ActionResult<List<Basket>>> GetBaskets(int raceId)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0) return Unauthorized();
        var baskets = await _raceService.GetBasketsByRaceIdAsync(currentUserId, raceId);
        return Ok(baskets);
    }

    [HttpPost("{raceId}/basket")]
    public async Task<ActionResult<Basket>> AddPigeonToBasket(int raceId, BasketRequest basketRequest)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0) return Unauthorized();
        var basketPigeonDto = _mapper.Map<BasketPigeonDto>(basketRequest);
        basketPigeonDto.RaceId = raceId;
        var basket = await _raceService.AddPigeonToBasketAsync(currentUserId, basketPigeonDto);
        return Ok(basket);
    }

    [HttpDelete("basket/{basketId}")]
    public async Task<ActionResult> RemovePigeonFromBasket(int basketId)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0) return Unauthorized();
        await _raceService.RemovePigeonFromBasketAsync(currentUserId, basketId);
        return Ok();
    }

    [HttpPost("{raceId}/save-basket")]
    public async Task<ActionResult> SaveBasket(int raceId)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0) return Unauthorized();
        await _raceService.UpdateRaceStatusAsync(currentUserId, raceId, "Basketed");
        return Ok();
    }

    [HttpPost("{raceId}/update-status")]
    public async Task<ActionResult<RaceViewModel>> UpdateRaceStatus(int raceId, StatusRequest statusRequest)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0) return Unauthorized();
        var race = await _raceService.UpdateRaceStatusAsync(currentUserId, raceId, statusRequest.StatusName);
        return Ok(_mapper.Map<RaceViewModel>(race));
    }

    [HttpGet("leaderboard/{raceId}")]
    public async Task<ActionResult<List<RaceResultViewModel>>> GetRaceLeaderboard(int raceId)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0) return Unauthorized();
        var leaderBoard = await _raceService.GetRaceLeaderBoardAsync(currentUserId, raceId);
        return Ok(_mapper.Map<List<RaceResultViewModel>>(leaderBoard));
    }
}