using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Commands
{
    public class CreateCustomerCommand : IRequest<string>
    {
        [StringLength(20, MinimumLength = 2)]
        public required string FullName { get; set; }

        [EmailAddress]
        public required string Email { get; set; }

        [StringLength(20, MinimumLength = 5)]
        public required string Password { get; set; }

        [Phone]
        public required string PhoneNumber { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public required string RoomId { get; set; }
    }
}
