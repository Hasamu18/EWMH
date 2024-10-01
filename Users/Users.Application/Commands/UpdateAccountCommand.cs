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
    public class UpdateAccountCommand : IRequest<string>
    {
        public string AccountId { get; set; }

        [StringLength(20, MinimumLength = 2)]
        public string FullName { get; set; }
        [Phone]
        public string PhoneNumber { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public UpdateAccountCommand(string accountId, string fullName, string phoneNumber, DateOnly dateOfBirth)
        {
            AccountId = accountId;
            FullName = fullName;
            PhoneNumber = phoneNumber;
            DateOfBirth = dateOfBirth;
        }
    }
}
