using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Commands
{
    public class CancelSPOfflinePaymentCommand : IRequest<(int, string)>
    {
        public string CustomerId { get; set; }

        public string ContractId { get; set; }

        public CancelSPOfflinePaymentCommand(string customerId, string contractId)
        {
            CustomerId = customerId;
            ContractId = contractId;
        }
    }
}
