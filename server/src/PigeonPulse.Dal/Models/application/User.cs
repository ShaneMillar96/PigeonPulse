using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PigeonPulse.Dal.Models.application;

[Table("users")]
[Microsoft.EntityFrameworkCore.Index("Email", Name = "users_email_key", IsUnique = true)]
[Microsoft.EntityFrameworkCore.Index("Username", Name = "users_username_key", IsUnique = true)]
public partial class User
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("username")]
    [StringLength(50)]
    public string Username { get; set; } = null!;

    [Column("email")]
    [StringLength(100)]
    public string Email { get; set; } = null!;

    [Column("password_hash")]
    [StringLength(255)]
    public string PasswordHash { get; set; } = null!;

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<Basket> Baskets { get; set; } = new List<Basket>();

    [InverseProperty("User")]
    public virtual ICollection<Pigeon> Pigeons { get; set; } = new List<Pigeon>();

    [InverseProperty("User")]
    public virtual ICollection<RaceResult> RaceResults { get; set; } = new List<RaceResult>();

    [InverseProperty("User")]
    public virtual ICollection<Race> Races { get; set; } = new List<Race>();
}
