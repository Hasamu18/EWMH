using System;
using System.Collections.Generic;

namespace Requests.Domain.Entities;

public partial class OrderDetails
{
    public string OrderId { get; set; } = null!;

    public string ProductId { get; set; } = null!;

    public int Quantity { get; set; }

    public int Price { get; set; }

    public int TotalPrice { get; set; }

    public virtual Orders Order { get; set; } = null!;

    public virtual Products Product { get; set; } = null!;
}
