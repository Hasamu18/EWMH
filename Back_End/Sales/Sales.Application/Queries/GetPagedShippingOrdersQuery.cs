using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetPagedShippingOrdersQuery : IRequest<object>
    {
        public int PageIndex { get; set; } = 1;

        public int Pagesize { get; set; } = 8;

        public required string LeaderId { get; set; }

        public string? SearchByPhone { get; set; } = null;

        public int Status { get; set; } = 0;
    }
}
