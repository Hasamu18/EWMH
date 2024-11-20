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
using Microsoft.EntityFrameworkCore;

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
                return (409, $"Email: {request.Email} đang tồn tại");

            var existingPhone = await _uow.AccountRepo.GetAsync(a => a.PhoneNumber.Equals(request.PhoneNumber));
            if (existingPhone.Any())
                return (409, $"Số điện thoại{request.PhoneNumber} đang tồn tại");

            var roles = await Tools.GetAllRole();
            var role = roles.Contains(request.Role.ToUpper());
            if (!role) 
                return (404, $"Vai trò: {request.Role} không được hỗ trợ");

            var account = UserMapper.Mapper.Map<Accounts>(request);
            if (request.Role.ToUpper().Equals(Role.AdminRole) ||
                request.Role.ToUpper().Equals(Role.ManagerRole) ||
                request.Role.ToUpper().Equals(Role.CustomerRole))
                return (400, $"Bạn không thể tạo tài khoản với vai trò: {request.Role}");
            else if (request.Role.ToUpper().Equals(Role.TeamLeaderRole))
                account.AccountId = $"{char.ToUpper(request.Role[0])}_{await _uow.LeaderRepo.Query().CountAsync() + 1:D10}";
            else
                account.AccountId = $"{char.ToUpper(request.Role[0])}_{await _uow.WorkerRepo.Query().CountAsync() + 1:D10}";

            string password = Tools.GenerateRandomString(10);                   
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
            var link = $"https://loloca.id.vn/change-password?token={Tools.EncryptString(request.Email)}";
            string subject = "Thiết lập lại mật khẩu";
            string body = $"<p>Nhấp vào đây để đổi mật khẩu:</p>" +
            $"<a href=\"{link}\" style=\"padding: 10px; color: white; background-color: #007BFF; text-decoration: none;\">" +
            $"Thiết lập lại mật khẩu</a>";
            await emailSender.SendEmailAsync(request.Email, subject, body);

            return (201, $"Nhân sự với vai trò: {request.Role} đã được tạo");
        }
    }
}
