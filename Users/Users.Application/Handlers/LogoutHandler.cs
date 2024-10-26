using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class LogoutHandler : IRequestHandler<LogoutCommand, string>
    {
        private readonly IUnitOfWork _uow;
        public LogoutHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<string> Handle(LogoutCommand request, CancellationToken cancellationToken)
        {
            var existingUser = (await _uow.RefreshTokenRepo.GetAsync(a => a.AccountId.Equals(request.AccountId))).ToList();
            if (existingUser.Count == 0)
                return "You must to login to logout";

            await _uow.RefreshTokenRepo.RemoveAsync(existingUser[0]);
            return "You logged out successfully";
        }
    }
}
