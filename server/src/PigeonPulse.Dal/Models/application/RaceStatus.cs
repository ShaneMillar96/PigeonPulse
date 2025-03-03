using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PigeonPulse.Dal.Models.application;

[Table("race_status")]
[Index("Name", Name = "race_status_name_key", IsUnique = true)]
public partial class RaceStatus
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(50)]
    public string Name { get; set; } = null!;

    [InverseProperty("RaceStatus")]
    public virtual ICollection<Race> Races { get; set; } = new List<Race>();
}
