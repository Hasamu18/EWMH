using MediatR;
using Requests.Application.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class UpdateProductToRequestCommand : IRequest<(int, string)>
    {
        public string HeadWorkerId { get; set; }

        public RequestDetail Product { get; set; }

        public UpdateProductToRequestCommand(string headWorkerId, RequestDetail product)
        {
            HeadWorkerId = headWorkerId;
            Product = product;
        }
    }
}
