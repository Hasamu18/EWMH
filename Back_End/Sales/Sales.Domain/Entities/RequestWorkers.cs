using System;
using System.Collections.Generic;

namespace Sales.Domain.Entities;

public partial class RequestWorkers
{
    public string RequestId { get; set; } = null!;

    public string WorkerId { get; set; } = null!;

    public bool IsLead { get; set; }

    public virtual Requests Request { get; set; } = null!;

    public virtual Workers Worker { get; set; } = null!;
}
