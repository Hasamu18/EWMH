using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sales.Domain.Entities;

public partial class Customers
{
    public string CustomerId { get; set; } = null!;

    public string CMT_CCCD { get; set; } = null!;
    [JsonIgnore]
    public virtual ICollection<Contracts> Contracts { get; set; } = new List<Contracts>();
    [JsonIgnore]
    public virtual Accounts Customer { get; set; } = null!;

    public virtual ICollection<Orders> Orders { get; set; } = new List<Orders>();

    public virtual ICollection<Requests> Requests { get; set; } = new List<Requests>();

    public virtual ICollection<Rooms> Rooms { get; set; } = new List<Rooms>();
}
