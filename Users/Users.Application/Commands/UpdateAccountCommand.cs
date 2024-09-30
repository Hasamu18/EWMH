using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Responses;
using Users.Domain.Entities;

namespace Users.Application.Commands
{
    public class UpdateAccountCommand : IRequest<TResponse<Account>>
    {
        public string Uid { get; set; }
        
        public string DisplayName { get; set; }
        public UpdateAccountCommand(string uid, string displayName)
        {
            Uid = uid;
            DisplayName = displayName;
        }
    }
}
