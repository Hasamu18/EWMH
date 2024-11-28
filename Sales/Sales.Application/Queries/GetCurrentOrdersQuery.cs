using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetCurrentOrdersQuery : IRequest<object>
    {
        public DateTime Date { get; set; }
        public int PageIndex { get; set; } = 1;

        public int Pagesize { get; set; } = 8;
    }
}
