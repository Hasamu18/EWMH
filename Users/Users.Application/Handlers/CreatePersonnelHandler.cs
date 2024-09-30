using FirebaseAdmin.Auth;
using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Mappers;
using Users.Application.Responses;
using Users.Application.Utility;
using Users.Domain.Entities;
using Users.Domain.IRepositories;
using static Users.Application.Utility.Constants;

namespace Users.Application.Handlers
{
    public class CreatePersonnelHandler : IRequestHandler<CreatePersonnelCommand, TResponse<Account>>
    {
        private readonly IUnitOfWork _uow;
        private readonly IAuthenRepository _authen;
        private readonly IConfiguration _config;
        public CreatePersonnelHandler(IUnitOfWork uow, IConfiguration config, IAuthenRepository authen)
        {
            _uow = uow;
            _config = config;
            _authen = authen;
        }

        public async Task<TResponse<Account>> Handle(CreatePersonnelCommand request, CancellationToken cancellationToken)
        {
            var existingEmail = await _authen.GetAuthenDbAsync(email: request.Email);
            if (existingEmail is not null)
                return new TResponse<Account>
                {
                    Message = "This email is existing",
                    Response = null
                };
            var existingPhone = await _authen.GetAuthenDbAsync(phone: request.PhoneNumber);
            if (existingPhone is not null)
                return new TResponse<Account>
                {
                    Message = "This phone number is existing",
                    Response = null
                };

            var roles = await Tools.GetAllRole();
            var role = roles.Contains(request.Role);
            if (!role) return new TResponse<Account>
            {
                Message = $"{request.Role} role is not supported",
                Response = null
            };

            UserRecordArgs userRecordArgs = new()
            {
                Email = request.Email,
                Password = Tools.GenerateRandomString(8),
                PhoneNumber = request.PhoneNumber
            };
            var userRecord = await _authen.CreateAuthenDbAsync(userRecordArgs);

            var time = Tools.GetDynamicTimeZone();
            string timeString = time.ToString("dd/MM/yyyy HH:mm:ss");

            var account = UserMapper.Mapper.Map<Account>(userRecord);
            account.DisplayName = request.DisplayName;
            account.PhotoUrl = $"https://firebasestorage.googleapis.com/v0/b/{_config["bucket_name"]}/o/default.png?alt=media";
            account.Role = request.Role;
            account.CreatedAt = timeString;
            var userInfo = await _uow.AccountRepo.CreateFireStoreAsync(account.Uid, account);

            EmailSender emailSender = new(_config);
            var link = await _authen.GetPasswordResetLinkAsync(request.Email);
            string subject = "Reset password";
            string body = $"<p>Click here to reset your password:</p>" +
            $"<a href=\"{link}\" style=\"padding: 10px; color: white; background-color: #007BFF; text-decoration: none;\">" +
            $"Reset password</a>";
            await emailSender.SendEmailAsync(request.Email, subject, body);

            return new TResponse<Account>
            {
                Message = $"The personnel with {request.Role} role has been created",
                Response = userInfo
            };
        }
    }
}
