using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Commands
{
    public class AddShippingOrdersToWorkerCommand : IRequest<(int, string)>
    {
        public required string WorkerId { get; set; }
        public required string[] ShippingIdsList { get; set; }
    }
}
