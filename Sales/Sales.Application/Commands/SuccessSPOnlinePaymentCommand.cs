using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Commands
{
    public class SuccessSPOnlinePaymentCommand : IRequest<(int, string)>
    {
        public string CustomerId { get; set; }
        public string ServicePackageId { get; set; }
        public long OrderCode { get; set; }
        public string ContractId { get; set; }

        public SuccessSPOnlinePaymentCommand(string customerId, string servicePackageId, long orderCode, string contractId)
        {
            CustomerId = customerId;
            ServicePackageId = servicePackageId;
            OrderCode = orderCode;
            ContractId = contractId;
        }
    }
}
