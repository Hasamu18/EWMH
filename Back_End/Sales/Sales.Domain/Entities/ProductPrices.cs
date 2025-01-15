using System;
using System.Collections.Generic;

namespace Sales.Domain.Entities;

public partial class ProductPrices
{
    public string ProductPriceId { get; set; } = null!;

    public string ProductId { get; set; } = null!;

    public DateTime Date { get; set; }

    public int PriceByDate { get; set; }

    public virtual Products Product { get; set; } = null!;
}
