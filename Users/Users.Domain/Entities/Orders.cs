using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class Orders
{
    public string OrderId { get; set; } = null!;

    public string CustomerId { get; set; } = null!;

    public DateTime? PurchaseTime { get; set; }

    public bool Status { get; set; }

    public string? FileUrl { get; set; }

    public long? OrderCode { get; set; }

    public virtual Customers Customer { get; set; } = null!;

    public virtual ICollection<OrderDetails> OrderDetails { get; set; } = new List<OrderDetails>();

    public virtual ICollection<WarrantyCards> WarrantyCards { get; set; } = new List<WarrantyCards>();
}
