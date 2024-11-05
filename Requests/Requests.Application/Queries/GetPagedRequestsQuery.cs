using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Queries
{
    public class GetPagedRequestsQuery : IRequest<List<object>>
    {
        public int PageIndex { get; set; } = 1;

        public int Pagesize { get; set; } = 8;

        public Request.Status Status { get; set; } = Request.Status.Requested;
    }
}
