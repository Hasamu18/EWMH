using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Mappers;
using Logger.Utility;
using Users.Domain.Entities;
using Users.Domain.IRepositories;
using static Logger.Utility.Constants;

namespace Users.Application.Handlers
{
    public class CreateCustomerHandler : IRequestHandler<CreateCustomerCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public CreateCustomerHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.Email))
                request.Email = "";

            var existingEmail = await _uow.AccountRepo.GetAsync(a => a.Email.Equals(request.Email));
            if (existingEmail.Any())
                return (409, $"{request.Email} is existing");

            var existingPhone = await _uow.AccountRepo.GetAsync(a => a.PhoneNumber.Equals(request.PhoneNumber));
            if (existingPhone.Any())
                return (409, $"{request.PhoneNumber} is existing");

            var existingApartment = (await _uow.RoomRepo.GetAsync(a => a.AreaId.Equals(request.AreaId) &&
                                                                      a.RoomCode.Equals(request.RoomCode))).ToList();
            if (existingApartment.Count == 0)
                return (404, "Unexisted apartment or room code");

            var existingRoom = (await _uow.CustomerRepo.GetAsync(a => a.RoomId.Equals(existingApartment[0].RoomId))).ToList();
            if (existingRoom.Count != 0)
                return (409, $"{request.RoomCode} room is linking to another account");

            var account = UserMapper.Mapper.Map<Accounts>(request);
            account.AccountId = Tools.GenerateRandomString(32);
            account.Password = Tools.HashString(request.Password);
            account.AvatarUrl = $"https://firebasestorage.googleapis.com/v0/b/{_config["bucket_name"]}/o/default.png?alt=media";
            account.IsDisabled = false;
            account.Role = Role.CustomerRole;
            await _uow.AccountRepo.AddAsync(account);

            Customers customer = new Customers()
            {
                CustomerId = account.AccountId,
                RoomId = existingApartment[0].RoomId,
            };
            await _uow.CustomerRepo.AddAsync(customer);

            return (201, $"The account is created");
        }
    }
}
