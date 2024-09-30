using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class ServicePackages
{
    public string ServicePackageId { get; set; } = null!;

    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public int? NumOfRequest { get; set; }

    public string? Policy { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<Contracts> Contracts { get; set; } = new List<Contracts>();

    public virtual ICollection<ServicePackagePrices> ServicePackagePrices { get; set; } = new List<ServicePackagePrices>();
}
