using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Commands
{
    public class CreatePasswordResetLinkCommand : IRequest<string>
    {
        [EmailAddress]
        public required string Email { get; set; }
    }
}
