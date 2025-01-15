using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetAllPendingContractsOfCustomerQuery : IRequest<object>
    {
        public string CustomerId { get; set; }

        public GetAllPendingContractsOfCustomerQuery(string customerId)
        {
            CustomerId = customerId;
        }
    }
}
