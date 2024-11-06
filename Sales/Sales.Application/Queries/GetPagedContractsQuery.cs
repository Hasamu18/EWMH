using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetPagedContractsQuery : IRequest<List<object>>
    {
        public int PageIndex { get; set; } = 1;

        public int Pagesize { get; set; } = 8;

        public string? SearchByPhone { get; set; } = null;

        public bool PurchaseTime_Des_Sort { get; set; } = true;
    }
}
