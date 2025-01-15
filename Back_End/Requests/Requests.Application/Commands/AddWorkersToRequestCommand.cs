using MediatR;
using Requests.Application.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class AddWorkersToRequestCommand : IRequest<(int, string)>
    {
        public string LeaderId { get; set; }

        public string RequestId { get; set; }

        public List<Worker> WorkerList { get; set; }

        public AddWorkersToRequestCommand(string leaderId, string requestId, List<Worker> workerList)
        {
            LeaderId = leaderId;
            RequestId = requestId;
            WorkerList = workerList;
        }
    }
}
