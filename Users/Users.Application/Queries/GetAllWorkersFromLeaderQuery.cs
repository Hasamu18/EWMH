using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Queries
{
    public class GetAllWorkersFromLeaderQuery : IRequest<object>
    {
        public string LeaderId { get; set; }
        public GetAllWorkersFromLeaderQuery(string leaderId)
        {
            LeaderId = leaderId;
        }
    }
}
