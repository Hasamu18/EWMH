using Amazon.Runtime.Internal;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetDesiredNumOfRequestsQuery : IRequest<object>
    {
        public string CustomerId { get; set; }
        public uint Quantity { get; set; }

        public GetDesiredNumOfRequestsQuery(string customerId, uint quantity)
        {
            CustomerId = customerId;
            Quantity = quantity;
        }
    }
}
