using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Logger.Utility
{
    public class JwtAuthen
    {
        private readonly IConfiguration _configuration;
        public JwtAuthen(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public (string at, string rt) GenerateJwtToken(string accountId, string role)
        {
            var jwtKey = _configuration["Jwt:Secret"];
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey ?? ""));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("accountId",accountId),
                new Claim("role", role.ToString())
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims: claims,
                expires: Tools.GetDynamicTimeZone().AddMinutes(60),
                signingCredentials: signingCredentials
                );
            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            var refreshToken = Tools.GenerateIdFormat32();
            return (accessToken, refreshToken);
        }

        public (string accountId, string role) ReadClaimsFromExpiredToken(string accessToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(accessToken);

            var accountId = jwtToken.Claims.FirstOrDefault(c => c.Type == "accountId")!.Value;
            var role = jwtToken.Claims.FirstOrDefault(c => c.Type == "role")!.Value;
            return (accountId, role);
        }
    }
}
