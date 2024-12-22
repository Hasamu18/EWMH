using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Domain.Entities;
public partial class WorkerHistory
{
    public string WorkerHistoryId { get; set; } = null!;

    public string LeaderId { get; set; } = null!;

    public string WorkerId { get; set; } = null!;

    public DateTime From { get; set; }

    public DateTime? To { get; set; }
}
