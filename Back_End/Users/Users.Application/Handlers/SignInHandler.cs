﻿using FirebaseAdmin.Auth;
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
using System.Text.RegularExpressions;

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
            List<Accounts> existingUser;
            if (IsEmail(request.Email_Or_Phone))
            {
                existingUser = (await _uow.AccountRepo.GetAsync(e => e.Email.Equals(request.Email_Or_Phone) &&
                               e.Password.Equals(Tools.HashString(request.Password)))).ToList();
            }
            else
            {
                existingUser = (await _uow.AccountRepo.GetAsync(e => e.PhoneNumber.Equals(request.Email_Or_Phone) &&
                               e.Password.Equals(Tools.HashString(request.Password)))).ToList();
            }

            if (!existingUser.Any())
                return (404, "Người dùng không tồn tại");

            if (existingUser.Any() && existingUser[0].IsDisabled)
                return (200, $"Tài khoản của bạn đã bị vô hiệu hóa " +
                    $"với lý do: {existingUser[0].DisabledReason}");

            JwtAuthen jwtAuthen = new(_config);
            var token = jwtAuthen.GenerateJwtToken(existingUser[0].AccountId, existingUser[0].Role);

            RefreshTokens refreshToken = new()
            {
                RefreshTokenId = $"RT_{Tools.GenerateRandomString(20)}",
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

        private bool IsEmail(string input)
        {
            var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            return emailRegex.IsMatch(input);
        }

        //private bool IsPhoneNumber(string input)
        //{
        //    var phoneRegex = new Regex(@"^(\+?\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$");
        //    return phoneRegex.IsMatch(input);
        //}
    }
}
