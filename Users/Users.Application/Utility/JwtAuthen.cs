using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Utility
{
    public class JwtAuthen
    {
        private readonly IConfiguration _configuration;
        public JwtAuthen(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public (string at, string rt) GenerateJwtToken(string uid, string role)
        {
            var jwtKey = _configuration["Jwt:Secret"];
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey ?? ""));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("uid",uid),
                new Claim("role", role.ToString())
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims: claims,
                expires: Tools.GetDynamicTimeZone().AddMinutes(5),
                signingCredentials: signingCredentials
                );
            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            var refreshToken = GenerateRefreshToken();
            return (accessToken, refreshToken);
        }

        public (string uid, string role) ReadClaimsFromExpiredToken(string accessToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(accessToken);

            var uid = jwtToken.Claims.FirstOrDefault(c => c.Type == "uid")!.Value;
            var role = jwtToken.Claims.FirstOrDefault(c => c.Type == "role")!.Value;
            return (uid, role);
        }
    }
}
