using FirebaseAdmin.Auth;
using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Mappers;
using Users.Application.Responses;
using Users.Application.Utility;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class SignInHandler : IRequestHandler<SignInCommand, object>
    {
        private readonly IUnitOfWork _uow;
        private readonly IAuthenRepository _authen;
        private readonly IConfiguration _config;
        public SignInHandler(IUnitOfWork uow, IConfiguration config, IAuthenRepository authen)
        {
            _uow = uow;
            _config = config;
            _authen = authen;
        }
        public async Task<object> Handle(SignInCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _authen.GetAuthenDbAsync(uid: request.Uid);
            if (existingUser is null)
                return "The customer does not exist";

            var getUserFireStore = await _uow.AccountRepo.GetFireStoreAsync(request.Uid);
            if (getUserFireStore is not null && existingUser.Disabled)
                return $"Your account has been disabled " +
                    $"by admin for reason {getUserFireStore.StatusInText}";

            var time = Tools.GetDynamicTimeZone();
            string timeString = time.ToString("dd/MM/yyyy HH:mm:ss");
            if (getUserFireStore is null)
            {
                var account = UserMapper.Mapper.Map<Account>(existingUser);
                account.DisplayName = "user " + Tools.GenerateRandomString(8);
                account.PhotoUrl = $"https://firebasestorage.googleapis.com/v0/b/{_config["bucket_name"]}/o/default.png?alt=media";
                account.Role = Constants.Role.CustomerRole;
                account.CreatedAt = timeString;
                getUserFireStore = await _uow.AccountRepo.CreateFireStoreAsync(account.Uid, account);
            }

            //if (existingUser.EmailVerified is false)
            //{
            //    EmailSender emailSender = new(_config);
            //    string subject = "Verify your email";
            //    string body = await _uow.AccountRepo.GetEmailVerificationLinkAsync(existingUser.Email);
            //    await emailSender.SendEmailAsync(existingUser.Email, subject, body);
            //}

            JwtAuthen jwtAuthen = new(_config);
            var token = jwtAuthen.GenerateJwtToken(getUserFireStore.Uid, getUserFireStore.Role);

            RefreshTokens refreshToken = new()
            {
                Uid = getUserFireStore.Uid,
                Token = token.Item2,
                ExpiredAt = time.AddYears(1).ToString("dd/MM/yyyy HH:mm:ss")
            };

            var getRefreshToken = await _uow.RefreshTokenRepo.GetFireStoreAsync(getUserFireStore.Uid);
            if (getRefreshToken is null)
                await _uow.RefreshTokenRepo.CreateFireStoreAsync(getUserFireStore.Uid, refreshToken);
            await _uow.RefreshTokenRepo.UpdateFireStoreAsync(getUserFireStore.Uid, refreshToken);

            return new
            {
                AT = token.at,
                RT = token.rt
            };
        }
    }
}
