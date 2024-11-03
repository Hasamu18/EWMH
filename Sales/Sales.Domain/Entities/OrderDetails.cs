using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sales.Domain.Entities;

public partial class OrderDetails
{
    public string OrderId { get; set; } = null!;

    public string ProductId { get; set; } = null!;

    public int Quantity { get; set; }

    public int Price { get; set; }

    public int TotalPrice { get; set; }

    [JsonIgnore]
    public virtual Orders Order { get; set; } = null!;

    public virtual Products Product { get; set; } = null!;
}
