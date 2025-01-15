using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Queries
{
    public class GetWorkerHistoryQuery : IRequest<object>
    {
        public required string WorkerId { get; set; }
    }
}
