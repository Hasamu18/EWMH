using FirebaseAdmin.Auth;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Utility;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class DisableAccountHandler : IRequestHandler<DisableAccountCommand, string>
    {
        private readonly IUnitOfWork _uow;
        public DisableAccountHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<string> Handle(DisableAccountCommand request, CancellationToken cancellationToken)
        {
            var existingUser = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(request.AccountId))).ToList();
            if (!existingUser.Any())
                return "The user does not exist";

            if (existingUser[0].Role.Equals(Constants.Role.AdminRole) ||
                existingUser[0].Role.Equals(Constants.Role.ManagerRole))
                return $"{existingUser[0].Role} role can not be disabled";

            existingUser[0].IsDisabled = true;
            existingUser[0].DisabledReason = request.DisabledReason;

            await _uow.AccountRepo.UpdateAsync(existingUser[0]);

            if (request.Disable)
                return $"{existingUser[0].FullName} has been disabled";
            return $"{existingUser[0].FullName} has been activated";
        }
    }
}
