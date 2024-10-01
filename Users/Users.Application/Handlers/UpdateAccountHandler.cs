using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Mappers;
using Users.Application.Responses;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class UpdateAccountHandler : IRequestHandler<UpdateAccountCommand, string>
    {
        private readonly IUnitOfWork _uow;
        public UpdateAccountHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<string> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
        {
            var existingUser = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(request.AccountId))).ToList();
            if (!existingUser.Any())
                return "The user does not exist";

            existingUser[0].FullName = request.FullName;
            existingUser[0].PhoneNumber = request.PhoneNumber;
            existingUser[0].DateOfBirth = request.DateOfBirth;
            await _uow.AccountRepo.UpdateAsync(existingUser[0]);

            return "Update successfully";
        }
    }
}
