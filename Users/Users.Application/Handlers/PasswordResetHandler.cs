using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Utility;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class PasswordResetHandler : IRequestHandler<PasswordResetCommand, string>
    {
        private readonly IUnitOfWork _uow;
        public PasswordResetHandler(IUnitOfWork uow)
        {
            _uow = uow; ;
        }
        public async Task<string> Handle(PasswordResetCommand request, CancellationToken cancellationToken)
        {
            var email = Tools.DecryptString(request.Token);
            var existingEmail = await _uow.AccountRepo.GetAsync(a => a.Email.Equals(email));
            if (!existingEmail.Any())
                return $"{email} is not registered account in our application";

            existingEmail.ToList()[0].Password = Tools.HashString(request.Password);
            await _uow.AccountRepo.UpdateAsync(existingEmail.ToList()[0]);

            return "Reset password successfully";
        }
    }
}
