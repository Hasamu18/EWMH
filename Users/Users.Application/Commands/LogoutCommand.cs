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
        public string AccountId { get; set; }
        public LogoutCommand(string accountId)
        {
            AccountId = accountId;
        }
    }
}
