﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PigeonPulse.Dal.Models.application;

[Table("races")]
public partial class Race
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Column("date", TypeName = "timestamp without time zone")]
    public DateTime Date { get; set; }

    [Column("race_status_id")]
    public int RaceStatusId { get; set; }

    [Column("distance")]
    [Precision(10, 2)]
    public decimal Distance { get; set; }

    [Column("weather_conditions")]
    [StringLength(255)]
    public string? WeatherConditions { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [InverseProperty("Race")]
    public virtual ICollection<Basket> Baskets { get; set; } = new List<Basket>();

    [ForeignKey("RaceStatusId")]
    [InverseProperty("Races")]
    public virtual RaceStatus RaceStatus { get; set; } = null!;

    [InverseProperty("Race")]
    public virtual ICollection<Raceresult> Raceresults { get; set; } = new List<Raceresult>();
}
