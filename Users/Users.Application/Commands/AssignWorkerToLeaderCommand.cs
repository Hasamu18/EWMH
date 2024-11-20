using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Commands
{
    public class AssignWorkerToLeaderCommand : IRequest<(int, string)>
    {
        public required string WorkerId { get; set; }

        public string? LeaderId { get; set; }
    }
}
