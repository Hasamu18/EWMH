using MediatR;
using Requests.Application.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class AddWarrantyCardsToRequestCommand : IRequest<(int, string)>
    {
        public string HeadWorkerId { get; set; }

        public string RequestId { get; set; }

        public List<string> WarrantyCardIdList { get; set; }

        public AddWarrantyCardsToRequestCommand(string headWorkerId, string requestId, List<string> warrantyCardIdList)
        {
            HeadWorkerId = headWorkerId;
            RequestId = requestId;
            WarrantyCardIdList = warrantyCardIdList;
        }
    }
}
