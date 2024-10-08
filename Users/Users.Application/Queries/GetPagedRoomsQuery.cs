using Amazon.Runtime.Internal;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Queries
{
    public class GetPagedRoomsQuery : IRequest<object>
    {        
        public int PageIndex { get; set; } = 1;

        public int Pagesize { get; set; } = 8;

        public required string AreaId { get; set; }
    }
}
