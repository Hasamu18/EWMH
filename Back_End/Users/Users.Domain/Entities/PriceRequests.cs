using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class PriceRequests
{
    public string PriceRequestId { get; set; } = null!;

    public string RequestId { get; set; } = null!;

    public DateTime Date { get; set; }

    public int PriceByDate { get; set; }

    public virtual Requests Request { get; set; } = null!;
}
