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
        private readonly IConfiguration _config;
        public SignInHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }
        public async Task<object> Handle(SignInCommand request, CancellationToken cancellationToken)
        {
            var existingUser = (await _uow.AccountRepo.GetAsync(e => e.Email.Equals(request.Email) &&
                                e.Password.Equals(Tools.HashString(request.Password)))).ToList();
            if (!existingUser.Any())
                return "The user does not exist";

            if (existingUser.Any() && existingUser[0].IsDisabled)
                return $"Your account has been disabled " +
                    $"for reason {existingUser[0].DisabledReason}";
            
            JwtAuthen jwtAuthen = new(_config);
            var token = jwtAuthen.GenerateJwtToken(existingUser[0].AccountId, existingUser[0].Role);

            RefreshTokens refreshToken = new()
            {
                AccountId = existingUser[0].AccountId,
                Token = token.Item2,
                ExpiredAt = Tools.GetDynamicTimeZone().AddYears(1)
            };

            var getRefreshToken = (await _uow.RefreshTokenRepo.GetAsync(g => g.AccountId.Equals(existingUser[0].AccountId))).ToList();
            if (!getRefreshToken.Any())
                await _uow.RefreshTokenRepo.AddAsync(refreshToken);
            await _uow.RefreshTokenRepo.UpdateAsync(refreshToken);

            return new
            {
                AT = token.at,
                RT = token.rt
            };
        }
    }
}
