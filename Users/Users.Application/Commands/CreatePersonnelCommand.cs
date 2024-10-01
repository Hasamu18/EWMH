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
    public class CreatePersonnelCommand : IRequest<string>
    {
        [StringLength(20, MinimumLength = 2)]
        public required string FullName { get; set; }

        [EmailAddress]
        public required string Email { get; set; }

        [Phone]
        public required string PhoneNumber { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public required string Role { get; set; }
    }
}
