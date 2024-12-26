using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sales.Domain.Entities;

public partial class Requests
{
    public string RequestId { get; set; } = null!;

    public string LeaderId { get; set; } = null!;

    public string CustomerId { get; set; } = null!;

    public string? ContractId { get; set; }

    public string RoomId { get; set; } = null!;

    public DateTime Start { get; set; }

    public DateTime? End { get; set; }

    public string CustomerProblem { get; set; } = null!;

    public string? Conclusion { get; set; }

    public int Status { get; set; }

    public int CategoryRequest { get; set; }

    public DateTime? PurchaseTime { get; set; }

    public int? TotalPrice { get; set; }

    public string? FileUrl { get; set; }

    public string? PreRepairEvidenceUrl { get; set; }

    public string? PostRepairEvidenceUrl { get; set; }

    public long? OrderCode { get; set; }

    public bool? IsOnlinePayment { get; set; }
    [JsonIgnore]
    public virtual Contracts Contract { get; set; } = null!;

    public virtual Customers Customer { get; set; } = null!;

    public virtual ICollection<Feedbacks> Feedbacks { get; set; } = new List<Feedbacks>();

    public virtual Leaders Leader { get; set; } = null!;

    public virtual ICollection<PriceRequests> PriceRequests { get; set; } = new List<PriceRequests>();

    public virtual ICollection<RequestDetails> RequestDetails { get; set; } = new List<RequestDetails>();

    public virtual ICollection<RequestWorkers> RequestWorkers { get; set; } = new List<RequestWorkers>();
}
