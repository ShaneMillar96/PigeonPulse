using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Models.application;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using PigeonPulse.Dal.Interfaces;

namespace PigeonPulse.Dal.Contexts;

public partial class PigeonPulseDbContext : BaseContext, IPigeonPulseDbContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly string? _connectionString;

    public PigeonPulseDbContext(IHttpContextAccessor httpContextAccessor, DbContextOptions<PigeonPulseDbContext> options, string? connectionString = null)
        : base(options)
    {
        _httpContextAccessor = httpContextAccessor;
        _connectionString = connectionString;
    }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Pigeon> Pigeons { get; set; }
    public virtual DbSet<Race> Races { get; set; }
    public virtual DbSet<RaceResult> RaceResults { get; set; }
    public virtual DbSet<Basket> Baskets { get; set; }
    public virtual DbSet<RaceStatus> RaceStatuses { get; set; }

    public int GetCurrentUserId()
    {
        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null || !user.Identity.IsAuthenticated) return 0;

        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId) ? userId : 0;
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var userId = GetCurrentUserId();
        if (userId > 0)
        {
            TrackUserDetails(userId);
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    private void TrackUserDetails(int userId)
    {
        var addedEntities = ChangeTracker.Entries<ICreatedByTracking>()
            .Where(x => x.State == EntityState.Added)
            .ToArray();

        foreach (var entity in addedEntities)
        {
            entity.Entity.UserId = userId;
        }
    }
}