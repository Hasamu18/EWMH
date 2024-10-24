using System;
using System.Collections.Generic;

namespace Sales.Domain.Entities;

public partial class Transaction
{
    public string TransactionId { get; set; } = null!;

    public int ServiceType { get; set; }

    public string CustomerId { get; set; } = null!;

    public string? AccountNumber { get; set; }

    public string? CounterAccountNumber { get; set; }

    public string? CounterAccountName { get; set; }

    public DateTime PurchaseTime { get; set; }

    public long? OrderCode { get; set; }

    public int Amount { get; set; }

    public string? Description { get; set; }

    public virtual Contracts? Contracts { get; set; }

    public virtual Orders? Orders { get; set; }

    public virtual Requests? Requests { get; set; }
}
