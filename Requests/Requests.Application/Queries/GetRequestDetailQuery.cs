using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetRequestDetailQuery : IRequest<(int, object)>
    {
        public required string RequestId { get; set; }
    }
}
