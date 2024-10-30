using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class WarrantyCards
{
    public string WarrantyCardId { get; set; } = null!;

    public string CustomerId { get; set; } = null!;

    public string ProductId { get; set; } = null!;

    public DateTime StartDate { get; set; }

    public DateTime ExpireDate { get; set; }
}
