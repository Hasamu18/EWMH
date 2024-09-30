using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Commands
{
    public class LogoutCommand : IRequest<string>
    {
        public string Uid { get; set; }
        public LogoutCommand(string uid)
        {
            Uid = uid;
        }
    }
}
