using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class Requests
{
    public string RequestId { get; set; } = null!;

    public string LeaderId { get; set; } = null!;

    public string CustomerId { get; set; } = null!;

    public DateTime Start { get; set; }

    public DateTime? End { get; set; }

    public string CustomerProblem { get; set; } = null!;

    public string? Conclusion { get; set; }

    public int Status { get; set; }

    public int CategoryRequest { get; set; }

    public int? TotalPrice { get; set; }

    public string? FileUrl { get; set; }

    public virtual Customers Customer { get; set; } = null!;

    public virtual Leaders Leader { get; set; } = null!;

    public virtual ICollection<PriceRequests> PriceRequests { get; set; } = new List<PriceRequests>();

    public virtual ICollection<RequestDetails> RequestDetails { get; set; } = new List<RequestDetails>();

    public virtual ICollection<Workers> Worker { get; set; } = new List<Workers>();
}
