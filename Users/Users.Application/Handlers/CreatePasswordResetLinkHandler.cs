using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Logger.Utility;
using Users.Domain.IRepositories;
using Constants.Utility;

namespace Users.Application.Handlers
{
    public class CreatePasswordResetLinkHandler : IRequestHandler<CreatePasswordResetLinkCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public CreatePasswordResetLinkHandler(IConfiguration config, IUnitOfWork uow)
        {
            _config = config;
            _uow = uow;
        }
        public async Task<(int, string)> Handle(CreatePasswordResetLinkCommand request, CancellationToken cancellationToken)
        {
            var existingEmail = await _uow.AccountRepo.GetAsync(a => a.Email.Equals(request.Email));
            if (!existingEmail.Any())
                return (404, $"{request.Email} is not registered account in our application");

            EmailSender emailSender = new(_config);
            var link = $"https://loloca.id.vn/change-password?token={Tools.EncryptString(request.Email)}";
            string subject = "Reset password";
            string body = $"<p>Click here to reset your password:</p>" +
            $"<a href=\"{link}\" style=\"padding: 10px; color: white; background-color: #007BFF; text-decoration: none;\">" +
            $"Reset password</a>";
            await emailSender.SendEmailAsync(request.Email, subject, body);

            return (200, $"Password reset link sent to {request.Email}");
        }
    }
}
