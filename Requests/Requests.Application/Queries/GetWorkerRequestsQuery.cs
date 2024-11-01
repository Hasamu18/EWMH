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
        public bool IsWarranty { get; set; }

        public GetWorkerRequestsQuery(string workerId, bool isWarranty)
        {
            WorkerId = workerId;
            IsWarranty = isWarranty;
        }
    }
}
