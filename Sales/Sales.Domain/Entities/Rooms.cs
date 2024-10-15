using System;
using System.Collections.Generic;

namespace Sales.Domain.Entities;

public partial class Rooms
{
    public string RoomId { get; set; } = null!;

    public string AreaId { get; set; } = null!;

    public string RoomCode { get; set; } = null!;

    public virtual ApartmentAreas Area { get; set; } = null!;

    public virtual ICollection<Customers> Customers { get; set; } = new List<Customers>();
}
