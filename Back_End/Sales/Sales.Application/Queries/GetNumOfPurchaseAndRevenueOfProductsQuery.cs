using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetNumOfPurchaseAndRevenueOfProductsQuery : IRequest<object>
    {
        public int? NumOfTop { get; set; } 
        public string? ProductId { get; set; }
    }
}
