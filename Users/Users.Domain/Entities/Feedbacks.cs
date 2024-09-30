using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class Feedbacks
{
    public string FeedbackId { get; set; } = null!;

    public string? CustomerId { get; set; }

    public string? Content { get; set; }

    public int? Rate { get; set; }

    public bool? Status { get; set; }

    public virtual Customers? Customer { get; set; }
}
