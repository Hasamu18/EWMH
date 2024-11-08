using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class CancelRequestCommand : IRequest<(int, string)>
    {
        public required string RequestId { get; set; }
    }
}
