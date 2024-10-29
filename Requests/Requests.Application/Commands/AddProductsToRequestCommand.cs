using MediatR;
using Requests.Application.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class AddProductsToRequestCommand : IRequest<(int, string)>
    {
        public string HeadWorkerId { get; set; }

        public string RequestId { get; set; }

        public List<Product> ProductList { get; set; }

        public AddProductsToRequestCommand(string headWorkerId, string requestId, List<Product> productList)
        {
            HeadWorkerId = headWorkerId;
            RequestId = requestId;
            ProductList = productList;
        }
    }
}
