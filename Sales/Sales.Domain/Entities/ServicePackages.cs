using System;
using System.Collections.Generic;

namespace Sales.Domain.Entities;

public partial class ServicePackages
{
    public string ServicePackageId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string ImageUrl { get; set; } = null!;

    public int NumOfRequest { get; set; }

    public string Policy { get; set; } = null!;

    public bool Status { get; set; }

    public virtual ICollection<Contracts> Contracts { get; set; } = new List<Contracts>();

    public virtual ICollection<ServicePackagePrices> ServicePackagePrices { get; set; } = new List<ServicePackagePrices>();
}
