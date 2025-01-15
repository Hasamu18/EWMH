using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class UpdateRequestPriceCommand : IRequest<(int, string)>
    {
        public uint Price { get; set; }
    }
}
