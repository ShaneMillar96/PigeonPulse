using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Models.application;

namespace PigeonPulse.Dal.Contexts;

public partial class PigeonPulseDbContext: DbContext
{
    public PigeonPulseDbContext(DbContextOptions<PigeonPulseDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Pigeon> Pigeons { get; set; }
    public virtual DbSet<Race> Races { get; set; }
    public virtual DbSet<Raceresult> RaceResults { get; set; }

}