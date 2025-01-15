using System;
using System.Collections.Generic;

namespace Users.Domain.Entities;

public partial class Rooms
{
    public string RoomId { get; set; } = null!;

    public string AreaId { get; set; } = null!;

    public string? CustomerId { get; set; }

    public virtual ApartmentAreas Area { get; set; } = null!;

    public virtual Customers? Customer { get; set; }
}
