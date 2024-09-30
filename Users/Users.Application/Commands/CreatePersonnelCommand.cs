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
    public class CreatePersonnelCommand : IRequest<TResponse<Account>>
    {
        [EmailAddress]
        public required string Email { get; set; }

        [Phone]
        public required string PhoneNumber { get; set; }

        [StringLength(20, MinimumLength = 6)]
        public required string DisplayName { get; set; }

        public required string Role { get; set; }
    }
}
