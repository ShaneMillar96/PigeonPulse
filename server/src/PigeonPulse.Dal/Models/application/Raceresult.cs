using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Interfaces;

namespace PigeonPulse.Dal.Models.application;

[Table("race_results")]
[Index("RaceId", "PigeonId", Name = "race_results_race_id_pigeon_id_key", IsUnique = true)]
public partial class RaceResult : ICreatedByTracking
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("race_id")]
    public int RaceId { get; set; }

    [Column("pigeon_id")]
    public int PigeonId { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("finish_time")]
    public TimeOnly FinishTime { get; set; }

    [ForeignKey("PigeonId")]
    [InverseProperty("RaceResults")]
    public virtual Pigeon Pigeon { get; set; } = null!;

    [ForeignKey("RaceId")]
    [InverseProperty("RaceResults")]
    public virtual Race Race { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("RaceResults")]
    public virtual User User { get; set; } = null!;
}
