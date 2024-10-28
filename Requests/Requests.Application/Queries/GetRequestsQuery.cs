using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetRequestsQuery : IRequest<List<object>>
    {
        public string LeaderId { get; set; }

        public uint? Status { get; set; }

        public DateOnly? StartDate { get; set; }

        public GetRequestsQuery(string leaderId, uint? status, DateOnly? startDate)
        {
            LeaderId = leaderId;
            Status = status;
            StartDate = startDate;
        }
    }
}
