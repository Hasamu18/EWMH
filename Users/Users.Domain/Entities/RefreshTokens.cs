using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class RefreshTokens
{
    public string AccountId { get; set; } = null!;

    public string Token { get; set; } = null!;

    public DateTime ExpiredAt { get; set; }
}
