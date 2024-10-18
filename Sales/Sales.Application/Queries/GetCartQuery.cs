using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetCartQuery : IRequest<(int, object)>
    {
        public string CustomerId { get; set; }

        public GetCartQuery(string customerId)
        {
            CustomerId = customerId;
        }
    }
}
