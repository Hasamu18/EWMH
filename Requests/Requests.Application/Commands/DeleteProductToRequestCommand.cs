using MediatR;
using Requests.Application.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class DeleteProductToRequestCommand : IRequest<(int, string)>
    {
        public string HeadWorkerId { get; set; }

        public string RequestDetailId { get; set; }

        public DeleteProductToRequestCommand(string headWorkerId, string requestDetailId)
        {
            HeadWorkerId = headWorkerId;
            RequestDetailId = requestDetailId;
        }
    }
}
