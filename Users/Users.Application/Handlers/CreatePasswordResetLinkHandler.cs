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
    public class CreatePasswordResetLinkHandler : IRequestHandler<CreatePasswordResetLinkCommand, string>
    {
        private readonly IAuthenRepository _authen;
        private readonly IConfiguration _config;
        public CreatePasswordResetLinkHandler(IConfiguration config, IAuthenRepository authen)
        {
            _config = config;
            _authen = authen;
        }
        public async Task<string> Handle(CreatePasswordResetLinkCommand request, CancellationToken cancellationToken)
        {
            try
            {
                EmailSender emailSender = new(_config);
                var link = await _authen.GetPasswordResetLinkAsync(request.Email);
                string subject = "Reset password";
                string body = $"<p>Click here to reset your password:</p>" +
                $"<a href=\"{link}\" style=\"padding: 10px; color: white; background-color: #007BFF; text-decoration: none;\">" +
                $"Reset password</a>";
                await emailSender.SendEmailAsync(request.Email, subject, body);

                return $"Password reset link sent to {request.Email}";
            }
            catch
            {
                return $"{request.Email} is not registered account in our application";
            }
        }
    }
}
