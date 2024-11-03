using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetWorkerRequestsQuery : IRequest<List<object>>
    {
        public string WorkerId { get; set; }
        public int RequestType { get; set; } = 1;

        public GetWorkerRequestsQuery(string workerId, int requestType)
        {
            WorkerId = workerId;
            RequestType = requestType;
        }
    }
}
