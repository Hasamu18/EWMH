using System;
using System.Collections.Generic;

namespace Sales.Domain.Entities;

public partial class RefreshTokens
{
    public string RefreshTokenId { get; set; } = null!;

    public string AccountId { get; set; } = null!;

    public string Token { get; set; } = null!;

    public DateTime ExpiredAt { get; set; }
}
