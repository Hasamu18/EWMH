using System;
using System.Collections.Generic;

namespace Requests.Domain.Entities;

public partial class Feedbacks
{
    public string FeedbackId { get; set; } = null!;

    public string RequestId { get; set; } = null!;

    public string Content { get; set; } = null!;

    public int Rate { get; set; }

    public bool Status { get; set; }

    public virtual Requests Request { get; set; } = null!;
}
