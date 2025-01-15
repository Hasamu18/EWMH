using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Queries
{
    public class GetRequestsQuery : IRequest<List<object>>
    {
        public string LeaderId { get; set; }

        public Request.Status? Status { get; set; }

        public DateOnly? StartDate { get; set; }

        public GetRequestsQuery(string leaderId, Request.Status? status, DateOnly? startDate)
        {
            LeaderId = leaderId;
            Status = status;
            StartDate = startDate;
        }
    }
}
