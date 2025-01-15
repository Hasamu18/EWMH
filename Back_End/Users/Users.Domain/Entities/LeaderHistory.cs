using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Domain.Entities;
public partial class LeaderHistory
{
    public string LeaderHistoryId { get; set; } = null!;

    public string AreaId { get; set; } = null!;

    public string LeaderId { get; set; } = null!;

    public DateTime From { get; set; }

    public DateTime? To { get; set; }
}
