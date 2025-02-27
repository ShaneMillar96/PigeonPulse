using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PigeonPulse.Dal.Models.application;

[Table("raceresults")]
public partial class Raceresult
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("pigeon_id")]
    public int PigeonId { get; set; }

    [Column("race_id")]
    public int RaceId { get; set; }

    [Column("finish_time", TypeName = "timestamp without time zone")]
    public DateTime FinishTime { get; set; }

    [Column("speed")]
    [Precision(10, 2)]
    public decimal? Speed { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [ForeignKey("PigeonId")]
    [InverseProperty("Raceresults")]
    public virtual Pigeon Pigeon { get; set; } = null!;

    [ForeignKey("RaceId")]
    [InverseProperty("Raceresults")]
    public virtual Race Race { get; set; } = null!;
}
