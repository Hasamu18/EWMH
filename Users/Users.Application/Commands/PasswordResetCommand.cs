using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Commands
{
    public class PasswordResetCommand : IRequest<(int, string)>
    {
        public required string Token { get; set; }

        [StringLength(20, MinimumLength = 5)]
        public required string Password { get; set; }
    }
}
