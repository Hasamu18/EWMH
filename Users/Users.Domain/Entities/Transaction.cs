using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class Transaction
{
    public string TransactionId { get; set; } = null!;

    public string? ServiceId { get; set; }

    public int ServiceType { get; set; }

    public string CustomerId { get; set; } = null!;

    public string? AccountNumber { get; set; }

    public string? CounterAccountNumber { get; set; }

    public string? CounterAccountName { get; set; }

    public DateTime PurchaseTime { get; set; }

    public long? OrderCode { get; set; }

    public int Amount { get; set; }

    public string? Description { get; set; }
}
