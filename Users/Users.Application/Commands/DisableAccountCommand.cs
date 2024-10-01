using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Commands
{
    public class DisableAccountCommand : IRequest<string>
    {
        public required string AccountId { get; set; }

        public bool Disable { get; set; }

        [StringLength(100, MinimumLength = 1)]
        public required string DisabledReason { get; set; }
    }
}
