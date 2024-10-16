using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetPagedProductQuery : IRequest<object>
    {
        public int PageIndex { get; set; } = 1;

        public int Pagesize { get; set; } = 8;

        public string? SearchByName { get; set; } = null;

        public bool InOfStock_Sort { get; set; } = true;

        public bool? Status { get; set; } = null;
    }
}
