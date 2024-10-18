using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Commands
{
    public class AddProductToCartCommand : IRequest<(int, string)>
    {
        public string CustomerId { get; set; }

        public string ProductId { get; set; }

        public int Quantity { get; set; }

        public AddProductToCartCommand(string customerId, string productId, int quantity)
        {
            CustomerId = customerId;
            ProductId = productId;
            Quantity = quantity;
        }
    }
}
