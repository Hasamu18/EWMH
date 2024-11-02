using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetWorkerRequestDetailsQuery : IRequest<ViewModels.WorkerRequestDetail>
    {
        public string RequestId { get; set; }
        public string WorkerId { get; set; }        
        public GetWorkerRequestDetailsQuery(string requestId, string workerId)
        {
            RequestId = requestId;
            WorkerId = workerId;            
        }

    }
}
