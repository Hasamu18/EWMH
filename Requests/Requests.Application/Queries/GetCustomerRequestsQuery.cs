using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetCustomerRequestsQuery : IRequest<List<object>>
    {
        public string CustomerId { get; set; }

        public uint? Status { get; set; }

        public DateOnly? StartDate { get; set; }

        public GetCustomerRequestsQuery(string customerId, uint? status, DateOnly? startDate)
        {
            CustomerId = customerId;
            Status = status;
            StartDate = startDate;
        }
    }
}
