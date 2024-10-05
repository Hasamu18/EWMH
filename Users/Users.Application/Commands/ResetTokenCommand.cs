using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Commands
{
    public class ResetTokenCommand : IRequest<(int, object)>
    {
        public required string AT { get; set; }
        public required string RT { get; set; }
    }
}
