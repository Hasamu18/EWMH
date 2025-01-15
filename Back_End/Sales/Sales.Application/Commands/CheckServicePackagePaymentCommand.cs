using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Commands
{
    public class CheckServicePackagePaymentCommand : IRequest<(int, string)>
    {
        public string CustomerId { get; set; }

        public string ServicePackageId { get; set; }

        public bool IsOnlinePayment { get; set; }

        public CheckServicePackagePaymentCommand(string customerId, string servicePackageId, bool isOnlinePayment)
        {
            CustomerId = customerId;
            ServicePackageId = servicePackageId;
            IsOnlinePayment = isOnlinePayment;
        }
    }
}
