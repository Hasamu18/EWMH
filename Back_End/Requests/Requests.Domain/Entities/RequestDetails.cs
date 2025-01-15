using System;
using System.Collections.Generic;

namespace Requests.Domain.Entities;

public partial class RequestDetails
{
    public string RequestDetailId { get; set; } = null!;

    public string RequestId { get; set; } = null!;

    public string ProductId { get; set; } = null!;

    public int Quantity { get; set; }

    public bool IsCustomerPaying { get; set; }

    public string Description { get; set; } = null!;

    public virtual Requests Request { get; set; } = null!;
}
