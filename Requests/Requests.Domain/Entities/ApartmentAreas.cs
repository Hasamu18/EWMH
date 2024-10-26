using System;
using System.Collections.Generic;

namespace Requests.Domain.Entities;

public partial class ApartmentAreas
{
    public string AreaId { get; set; } = null!;

    public string LeaderId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string ManagementCompany { get; set; } = null!;

    public string AvatarUrl { get; set; } = null!;

    public virtual Leaders Leader { get; set; } = null!;

    public virtual ICollection<Rooms> Rooms { get; set; } = new List<Rooms>();
}
