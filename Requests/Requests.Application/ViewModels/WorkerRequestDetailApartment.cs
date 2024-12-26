using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class WorkerRequestDetailApartment
    {
        public string AreaId { get; set; } = null!;

        public string LeaderId { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string Description { get; set; } = null!;

        public string Address { get; set; } = null!;

        public string ManagementCompany { get; set; } = null!;

        public string AvatarUrl { get; set; } = null!;

        public string? FileUrl { get; set; }
    }
}
