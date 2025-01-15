using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetFreeWorkersFromLeaderQuery : IRequest<List<object>>
    {
        public string LeaderId { get; set; }
        public bool IsFree { get; set; }

        public GetFreeWorkersFromLeaderQuery(string leaderId, bool isFree)
        {
            LeaderId = leaderId;
            IsFree = isFree;
        }
    }
}
