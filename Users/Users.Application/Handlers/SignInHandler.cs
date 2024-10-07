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
using Logger.Utility;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class SignInHandler : IRequestHandler<SignInCommand, (int, object)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public SignInHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }
        public async Task<(int, object)> Handle(SignInCommand request, CancellationToken cancellationToken)
        {
            var existingUser = (await _uow.AccountRepo.GetAsync(e => e.Email.Equals(request.Email) &&
                                e.Password.Equals(Tools.HashString(request.Password)))).ToList();
            if (!existingUser.Any())
                return (404, "The user does not exist");

            if (existingUser.Any() && existingUser[0].IsDisabled)
                return (200, $"Your account has been disabled " +
                    $"for reason {existingUser[0].DisabledReason}");
            
            JwtAuthen jwtAuthen = new(_config);
            var token = jwtAuthen.GenerateJwtToken(existingUser[0].AccountId, existingUser[0].Role);

            RefreshTokens refreshToken = new()
            {
                RefreshTokenId = Tools.GenerateIdFormat32(),
                AccountId = existingUser[0].AccountId,
                Token = token.Item2,
                ExpiredAt = Tools.GetDynamicTimeZone().AddYears(1)
            };

            var getRefreshToken = (await _uow.RefreshTokenRepo.GetAsync(g => g.AccountId.Equals(existingUser[0].AccountId))).ToList();
            if (getRefreshToken.Count == 0)
                await _uow.RefreshTokenRepo.AddAsync(refreshToken);
            else
            {
                getRefreshToken[0].Token = token.Item2;
                await _uow.RefreshTokenRepo.UpdateAsync(getRefreshToken[0]);             
            }

            return (200, new
            {
                AT = token.at,
                RT = token.rt
            });
        }
    }
}
