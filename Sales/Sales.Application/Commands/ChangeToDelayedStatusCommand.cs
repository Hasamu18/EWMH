using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Commands
{
    public class ChangeToDelayedStatusCommand : IRequest<(int, string)>
    {
        public required string ShippingId { get; set; }
    }
}
