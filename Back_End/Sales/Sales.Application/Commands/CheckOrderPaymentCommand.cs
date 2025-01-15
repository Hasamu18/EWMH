using MediatR;
using Sales.Application.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Commands
{
    public class CheckOrderPaymentCommand : IRequest<(int, string)>
    {
        public string CustomerId { get; set; }

        public string? CustomerNote { get; set; }

        public string Address { get; set; }

        public CheckOrderPaymentCommand(string customerId, string? customerNote, string address)
        {
            CustomerId = customerId;
            CustomerNote = customerNote;
            Address = address;
        }
    }
}
