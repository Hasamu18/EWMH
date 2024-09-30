using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class Products
{
    public string ProductId { get; set; } = null!;

    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public int? InOfStock { get; set; }

    public int? WarantyMonths { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<OrderDetails> OrderDetails { get; set; } = new List<OrderDetails>();

    public virtual ICollection<ProductPrices> ProductPrices { get; set; } = new List<ProductPrices>();

    public virtual ICollection<RequestDetails> RequestDetails { get; set; } = new List<RequestDetails>();
}
