using Google.Api.Gax.ResourceNames;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetWarrantyCardsQuery : IRequest<object>
    {

        public string CustomerId { get; set; }
        public string ProductName { get; set; }
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 4;

        public GetWarrantyCardsQuery(string customerId, string productName, int pageIndex, int pageSize)
        {
            CustomerId = customerId;
            ProductName = productName;
            PageIndex = pageIndex;
            PageSize = pageSize;
        }
    }
}
