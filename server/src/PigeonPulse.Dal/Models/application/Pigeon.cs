using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PigeonPulse.Dal.Interfaces;

namespace PigeonPulse.Dal.Models.application;

[Table("pigeons")]
[Microsoft.EntityFrameworkCore.Index("RingNumber", Name = "pigeons_ring_number_key", IsUnique = true)]
public partial class Pigeon : ICreatedByTracking
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("ring_number")]
    [StringLength(20)]
    public string RingNumber { get; set; } = null!;

    [Column("color")]
    [StringLength(50)]
    public string? Color { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [Column("sex")]
    [StringLength(10)]
    public string Sex { get; set; } = null!;

    [Column("fatherid")]
    public int? Fatherid { get; set; }

    [Column("motherid")]
    public int? Motherid { get; set; }

    [InverseProperty("Pigeon")]
    public virtual ICollection<Basket> Baskets { get; set; } = new List<Basket>();

    [ForeignKey("Fatherid")]
    [InverseProperty("InverseFather")]
    public virtual Pigeon? Father { get; set; }

    [InverseProperty("Father")]
    public virtual ICollection<Pigeon> InverseFather { get; set; } = new List<Pigeon>();

    [InverseProperty("Mother")]
    public virtual ICollection<Pigeon> InverseMother { get; set; } = new List<Pigeon>();

    [ForeignKey("Motherid")]
    [InverseProperty("InverseMother")]
    public virtual Pigeon? Mother { get; set; }

    [InverseProperty("Pigeon")]
    public virtual ICollection<RaceResult> RaceResults { get; set; } = new List<RaceResult>();

    [ForeignKey("UserId")]
    [InverseProperty("Pigeons")]
    public virtual User User { get; set; } = null!;
}
