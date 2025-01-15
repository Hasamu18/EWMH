using System;
using System.Collections.Generic;

namespace Requests.Domain.Entities;

public partial class Leaders
{
    public string LeaderId { get; set; } = null!;

    public virtual ICollection<ApartmentAreas> ApartmentAreas { get; set; } = new List<ApartmentAreas>();

    public virtual Accounts Leader { get; set; } = null!;

    public virtual ICollection<Requests> Requests { get; set; } = new List<Requests>();

    public virtual ICollection<Workers> Workers { get; set; } = new List<Workers>();
}
