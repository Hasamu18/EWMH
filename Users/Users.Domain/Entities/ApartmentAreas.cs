using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class ApartmentAreas
{
    public string AreaId { get; set; } = null!;

    public string? LeaderId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? Address { get; set; }

    public string? ManagementCompany { get; set; }

    public virtual Leaders? Leader { get; set; }

    public virtual ICollection<Rooms> Rooms { get; set; } = new List<Rooms>();
}
