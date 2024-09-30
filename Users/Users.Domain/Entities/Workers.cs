using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class Workers
{
    public string WorkerId { get; set; } = null!;

    public string LeaderId { get; set; } = null!;

    public virtual Leaders Leader { get; set; } = null!;

    public virtual Accounts Worker { get; set; } = null!;

    public virtual ICollection<Requests> Request { get; set; } = new List<Requests>();
}
