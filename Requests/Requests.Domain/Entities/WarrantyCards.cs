using System;
using System.Collections.Generic;

namespace Requests.Domain.Entities;

public partial class WarrantyCards
{
    public string WarrantyCardId { get; set; } = null!;

    public string OrderId { get; set; } = null!;

    public string ProductId { get; set; } = null!;

    public DateTime StartDate { get; set; }

    public DateTime ExpireDate { get; set; }

    public virtual Orders Order { get; set; } = null!;
}
