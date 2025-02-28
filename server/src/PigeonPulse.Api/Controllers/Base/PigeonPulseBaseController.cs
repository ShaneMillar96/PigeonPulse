using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Dal.Contexts;

namespace PigeonPulse.Api.Controllers.Base;

[Authorize] // Require authentication by default
[ApiController]
public class PigeonPulseBaseController : ControllerBase
{
    private readonly PigeonPulseDbContext _context;

    public PigeonPulseBaseController(PigeonPulseDbContext context)
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