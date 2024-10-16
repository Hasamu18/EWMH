using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Commands
{
    public class DisableProductCommand : IRequest<(int, string)>
    {
        public required string ProductId { get; set; }

        public bool Status { get; set; }
    }
}
