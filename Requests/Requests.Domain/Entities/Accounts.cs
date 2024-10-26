using System;
using System.Collections.Generic;

namespace Requests.Domain.Entities;

public partial class Accounts
{
    public string AccountId { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string AvatarUrl { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public bool IsDisabled { get; set; }

    public string? DisabledReason { get; set; }

    public string Role { get; set; } = null!;

    public virtual Customers? Customers { get; set; }

    public virtual Leaders? Leaders { get; set; }

    public virtual Workers? Workers { get; set; }
}
