using static Logger.Utility.Constants;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetPagedTransactionOfCustomerQuery : IRequest<object>
    {
        public required string CustomerId { get; set; }

        public int PageIndex { get; set; } = 1;

        public int Pagesize { get; set; } = 8;

        public Request.ServiceType ServiceType { get; set; } = 0;

        public DateOnly? StartDate { get; set; }

        public DateOnly? EndDate { get; set; }
    }
}
