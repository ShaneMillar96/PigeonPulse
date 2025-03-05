using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Dal.Interfaces;

namespace PigeonPulse.Api.Controllers.Base;

[Authorize] 
[ApiController]
public class PigeonPulseBaseController : ControllerBase
{
    private readonly IPigeonPulseDbContext _context;

    public PigeonPulseBaseController(IPigeonPulseDbContext context)
    {
        _context = context;
    }

    protected int GetCurrentUserId()
    {
        var user = HttpContext.User;
        if (user == null || !user.Identity.IsAuthenticated) return 0;

        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId) ? userId : 0;
    }
}