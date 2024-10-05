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
    public class UpdateAccountCommand : IRequest<(int, string)>
    {
        public string AccountId { get; set; }
        public string FullName { get; set; }
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
