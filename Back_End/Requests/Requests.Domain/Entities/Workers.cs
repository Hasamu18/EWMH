using System;
using System.Collections.Generic;

namespace Requests.Domain.Entities;

public partial class Workers
{
    public string WorkerId { get; set; } = null!;

    public string? LeaderId { get; set; }

    public virtual Leaders? Leader { get; set; }

    public virtual ICollection<RequestWorkers> RequestWorkers { get; set; } = new List<RequestWorkers>();

    public virtual Accounts Worker { get; set; } = null!;
}
