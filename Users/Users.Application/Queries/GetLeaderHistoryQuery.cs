using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Queries
{
    public class GetLeaderHistoryQuery : IRequest<object>
    {
        public required string LeaderId { get; set; }
    }
}
