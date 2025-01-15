using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class SuccessRequestPaymentCommand : IRequest<(int, string)>
    {
        public long? OrderCode { get; set; }

        public required string RequestId { get; set; }

        public required string Conclusion { get; set; }
    }
}
