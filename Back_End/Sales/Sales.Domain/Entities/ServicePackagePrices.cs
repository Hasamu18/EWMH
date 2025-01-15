using System;
using System.Collections.Generic;

namespace Sales.Domain.Entities;

public partial class ServicePackagePrices
{
    public string ServicePackagePriceId { get; set; } = null!;

    public string ServicePackageId { get; set; } = null!;

    public DateTime Date { get; set; }

    public int PriceByDate { get; set; }

    public virtual ServicePackages ServicePackage { get; set; } = null!;
}
