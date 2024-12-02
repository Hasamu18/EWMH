using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetShippingOrdersOfWorkerQuery : IRequest<object>
    {
        public required string WorkerId { get; set; }

        public string? ShippingId { get; set; }
    }
}
