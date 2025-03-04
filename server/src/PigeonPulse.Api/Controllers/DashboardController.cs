using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Api.Controllers.Base;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : PigeonPulseBaseController
{
    private readonly IDashboardService _dashboardService;
    private readonly IMapper _mapper;
    
    public DashboardController(PigeonPulseDbContext context, IDashboardService dashboardService, IMapper mapper)
        : base(context)
    {
        _dashboardService = dashboardService;
        _mapper = mapper;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var userId = GetCurrentUserId();
        var dashboardData = await _dashboardService.GetDashboardData(userId);
        return Ok(dashboardData);
    }
}