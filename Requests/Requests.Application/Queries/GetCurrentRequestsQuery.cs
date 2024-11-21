using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetCurrentRequestsQuery : IRequest<object>
    {
        public int PageIndex { get; set; } = 1;

        public int Pagesize { get; set; } = 8;
    }
}
