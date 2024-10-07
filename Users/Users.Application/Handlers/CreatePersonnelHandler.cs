using FirebaseAdmin.Auth;
using Google.Api;
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
using Logger.Utility;
using Users.Domain.Entities;
using Users.Domain.IRepositories;
using static Logger.Utility.Constants;
using Constants.Utility;

namespace Users.Application.Handlers
{
    public class CreatePersonnelHandler : IRequestHandler<CreatePersonnelCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public CreatePersonnelHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(CreatePersonnelCommand request, CancellationToken cancellationToken)
        {
            var existingEmail = await _uow.AccountRepo.GetAsync(a => a.Email.Equals(request.Email));
            if (existingEmail.Any())
                return (409, $"{request.Email} is existing");
                    
            var roles = await Tools.GetAllRole();
            var role = roles.Contains(request.Role.ToUpper());
            if (!role) 
                return (404, $"{request.Role} role is not supported");

            if (request.Role.ToUpper().Equals(Role.AdminRole) ||
                request.Role.ToUpper().Equals(Role.ManagerRole) ||
                request.Role.ToUpper().Equals(Role.CustomerRole))
                return (400, $"You can not create {request.Role} account");

            string password = Tools.GenerateRandomString(10);
            var account = UserMapper.Mapper.Map<Accounts>(request);
            account.AccountId = Tools.GenerateRandomString(32);
            account.Password = Tools.HashString(password);
            account.AvatarUrl = $"https://firebasestorage.googleapis.com/v0/b/{_config["bucket_name"]}/o/default.png?alt=media";
            account.IsDisabled = false;
            account.Role = request.Role.ToUpper();
            await _uow.AccountRepo.AddAsync(account);

            if (request.Role.ToUpper().Equals(Role.TeamLeaderRole))
            {
                Leaders leader = new Leaders()
                {
                    LeaderId = account.AccountId
                };
                await _uow.LeaderRepo.AddAsync(leader);
            }
            else if (request.Role.ToUpper().Equals(Role.WorkerRole))
            {
                Workers worker = new Workers()
                {
                    WorkerId = account.AccountId
                };
                await _uow.WorkerRepo.AddAsync(worker);
            }

            EmailSender emailSender = new(_config);
            var link = $"http://localhost:5500/reset.html?token={Tools.EncryptString(request.Email)}";
            string subject = "Reset password";
            string body = $"<p>Click here to reset your password:</p>" +
            $"<a href=\"{link}\" style=\"padding: 10px; color: white; background-color: #007BFF; text-decoration: none;\">" +
            $"Reset password</a>";
            await emailSender.SendEmailAsync(request.Email, subject, body);

            return (201, $"The personnel with {request.Role} role has been created");
        }
    }
}
