using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Utility;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class ResetTokenHandler : IRequestHandler<ResetTokenCommand, (int, object)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public ResetTokenHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, object)> Handle(ResetTokenCommand request, CancellationToken cancellationToken)
        {            
            var getRefreshToken = (await _uow.RefreshTokenRepo.GetAsync(e => e.Token.Equals(request.RT))).ToList();
            if (getRefreshToken.Count == 0)
                return (401, "Unexisted refresh token");

            var currentTime = Tools.GetDynamicTimeZone();
            if (currentTime.CompareTo(getRefreshToken[0].ExpiredAt) > 0)
                return (401, "You have been logged out of the system, you need to log in again");

            JwtAuthen jwtAuthen = new(_config);
            var claims = jwtAuthen.ReadClaimsFromExpiredToken(request.AT);

            var token = jwtAuthen.GenerateJwtToken(claims.accountId, claims.role);
            getRefreshToken[0].Token = token.Item2;
            await _uow.RefreshTokenRepo.UpdateAsync(getRefreshToken[0]);

            return (200, new
            {
                AT = token.at,
                RT = token.rt
            });
        }
    }
}
