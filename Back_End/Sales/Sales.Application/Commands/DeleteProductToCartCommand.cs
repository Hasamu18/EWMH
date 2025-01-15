using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Commands
{
    public class DeleteProductToCartCommand : IRequest<(int, string)>
    {
        public string CustomerId { get; set; }

        public string ProductId { get; set; }

        public DeleteProductToCartCommand(string customerId, string productId)
        {
            CustomerId = customerId;
            ProductId = productId;
        }
    }
}
