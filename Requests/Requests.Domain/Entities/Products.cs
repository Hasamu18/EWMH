using System;
using System.Collections.Generic;

namespace Requests.Domain.Entities;

public partial class Products
{
    public string ProductId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string ImageUrl { get; set; } = null!;

    public int InOfStock { get; set; }

    public int WarantyMonths { get; set; }

    public bool Status { get; set; }

    public virtual ICollection<OrderDetails> OrderDetails { get; set; } = new List<OrderDetails>();

    public virtual ICollection<ProductPrices> ProductPrices { get; set; } = new List<ProductPrices>();
}
