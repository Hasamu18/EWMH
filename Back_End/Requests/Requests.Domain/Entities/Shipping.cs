using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Domain.Entities;
public partial class Shipping
{
    public string ShippingId { get; set; } = null!;

    public string LeaderId { get; set; } = null!;

    public string CustomerId { get; set; } = null!;

    public string? WorkerId { get; set; }

    public DateTime? ShipmentDate { get; set; }

    public DateTime? DeliveriedDate { get; set; }

    public int Status { get; set; }

    public string? CustomerNote { get; set; }

    public string? ProofFileUrl { get; set; }

    public string? Address { get; set; }
}