using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Queries
{
    public class GetCustomerRequestsQuery : IRequest<List<object>>
    {
        public string CustomerId { get; set; }

        public Request.Status? Status { get; set; }

        public DateOnly? StartDate { get; set; }

        public GetCustomerRequestsQuery(string customerId, Request.Status? status, DateOnly? startDate)
        {
            CustomerId = customerId;
            Status = status;
            StartDate = startDate;
        }
    }
}
