using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PigeonPulse.Dal.Models.application;

[Table("baskets")]
[Index("PigeonId", "RaceId", Name = "baskets_pigeon_id_race_id_key", IsUnique = true)]
public partial class Basket
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("pigeon_id")]
    public int PigeonId { get; set; }

    [Column("race_id")]
    public int RaceId { get; set; }

    [Column("basketed_at", TypeName = "timestamp without time zone")]
    public DateTime? BasketedAt { get; set; }

    [ForeignKey("PigeonId")]
    [InverseProperty("Baskets")]
    public virtual Pigeon Pigeon { get; set; } = null!;

    [ForeignKey("RaceId")]
    [InverseProperty("Baskets")]
    public virtual Race Race { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Baskets")]
    public virtual User User { get; set; } = null!;
}
