using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Queries
{
    public class GetAllWorkersFromLeaderV2Query : IRequest<object>
    {
        public required string LeaderId { get; set; }
    }
}
