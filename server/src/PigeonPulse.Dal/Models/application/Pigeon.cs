using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Interfaces;

namespace PigeonPulse.Dal.Models.application;

[Table("pigeons")]
[Index("RingNumber", Name = "pigeons_ring_number_key", IsUnique = true)]
public partial class Pigeon : ICreatedByTracking
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("name")]
    [StringLength(50)]
    public string Name { get; set; } = null!;

    [Column("ring_number")]
    [StringLength(20)]
    public string RingNumber { get; set; } = null!;

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [InverseProperty("Pigeon")]
    public virtual ICollection<Raceresult> Raceresults { get; set; } = new List<Raceresult>();

    [ForeignKey("UserId")]
    [InverseProperty("Pigeons")]
    public virtual User User { get; set; } = null!;
}
