using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetShippingOrderQuery : IRequest<object>
    {
        public required string ShippingId { get; set; }
    }
}
