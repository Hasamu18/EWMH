using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class CheckRequestOnlinePaymentCommand : IRequest<(int, string)>
    {
        public string HeadWorkerId { get; set; }

        public string RequestId { get; set; }

        public string Conclusion { get; set; }

        public CheckRequestOnlinePaymentCommand(string headWorkerId, string requestId, string conclusion)
        {
            HeadWorkerId = headWorkerId;
            RequestId = requestId;
            Conclusion = conclusion;
        }
    }
}
