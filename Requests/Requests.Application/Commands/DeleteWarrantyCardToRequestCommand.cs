using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class DeleteWarrantyCardToRequestCommand : IRequest<(int, string)>
    {
        public string HeadWorkerId { get; set; }

        public string RequestId { get; set; }

        public string WarrantyCardId { get; set; }

        public DeleteWarrantyCardToRequestCommand(string headWorkerId, string requestId, string warrantyCardId)
        {
            HeadWorkerId = headWorkerId;
            RequestId = requestId;
            WarrantyCardId = warrantyCardId;
        }
    }
}
