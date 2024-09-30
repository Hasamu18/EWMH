using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class Accounts
{
    public string AccountId { get; set; } = null!;

    public string? FullName { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? PhoneNumber { get; set; }

    public string? AvatarUrl { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public bool? IsDisabled { get; set; }

    public string? DisabledReason { get; set; }

    public string? Role { get; set; }

    public virtual Customers? Customers { get; set; }

    public virtual Leaders? Leaders { get; set; }

    public virtual Workers? Workers { get; set; }
}
