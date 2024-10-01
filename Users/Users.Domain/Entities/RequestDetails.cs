using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class RequestDetails
{
    public string RequestId { get; set; } = null!;

    public string ProductId { get; set; } = null!;

    public int Quantity { get; set; }

    public bool IsCustomerPaying { get; set; }

    public string Description { get; set; } = null!;

    public virtual Products Product { get; set; } = null!;

    public virtual Requests Request { get; set; } = null!;
}
