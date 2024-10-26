using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Commands
{
    public class CreateCustomerCommand : IRequest<(int, string)>
    {
        [StringLength(20, MinimumLength = 2)]
        public required string FullName { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [Phone]
        public required string PhoneNumber { get; set; }

        [StringLength(20, MinimumLength = 5)]
        public required string Password { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public required string AreaId { get; set; }

        public required List<string> RoomIds { get; set; }
    }
}
