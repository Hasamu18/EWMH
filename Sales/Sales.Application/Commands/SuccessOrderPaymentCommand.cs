using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Commands
{
    public class SuccessOrderPaymentCommand : IRequest<(int, string)>
    {
        public long OrderCode { get; set; }
        public required string Id1 { get; set; }
    }
}
