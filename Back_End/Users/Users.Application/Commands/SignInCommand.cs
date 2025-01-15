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
    public class SignInCommand : IRequest<(int, object)>
    {
        public required string Email_Or_Phone { get; set; }

        public required string Password { get; set; }
    }
}
