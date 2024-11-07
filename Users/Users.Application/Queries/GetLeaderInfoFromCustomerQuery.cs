using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Responses;

namespace Users.Application.Queries
{
    public class GetLeaderInfoFromCustomerQuery : IRequest<object>
    {
        public string CustomerId { get; set; }
        public GetLeaderInfoFromCustomerQuery(string customerId)
        {
            CustomerId = customerId;
        }
    }
}
