using MediatR;
using Sales.Application.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Commands
{
    public class OrderPaymentCommand : IRequest<(int, string)>
    {
        public required List<ProductAndQuantity> Order { get; set; }
    }
}
