using MediatR;
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

        public List<(string, uint, bool, string)> ProductList { get; set; }

        public AddProductsToRequestCommand(string headWorkerId, string requestId, List<(string, uint, bool, string)> productList)
        {
            HeadWorkerId = headWorkerId;
            RequestId = requestId;
            ProductList = productList;
        }
    }
}
