using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class Contracts
{
    public string ContractId { get; set; } = null!;

    public string CustomerId { get; set; } = null!;

    public string ServicePackageId { get; set; } = null!;

    public string? FileUrl { get; set; }

    public DateTime? PurchaseTime { get; set; }

    public virtual Customers Customer { get; set; } = null!;

    public virtual ServicePackages ServicePackage { get; set; } = null!;
}
