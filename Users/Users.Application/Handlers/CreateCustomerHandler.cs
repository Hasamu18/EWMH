using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Mappers;
using Users.Application.Utility;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class CreateCustomerHandler : IRequestHandler<CreateCustomerCommand, string>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public CreateCustomerHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<string> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
        {
            var existingEmail = await _uow.AccountRepo.GetAsync(a => a.Email.Equals(request.Email));
            if (existingEmail.Any())
                return $"{request.Email} is existing";

            var account = UserMapper.Mapper.Map<Accounts>(request);
            account.AccountId = Tools.GenerateIdFormat32();
            account.AvatarUrl = $"https://firebasestorage.googleapis.com/v0/b/{_config["bucket_name"]}/o/default.png?alt=media";
            account.IsDisabled = false;
            account.Role = Constants.Role.CustomerRole;
            await _uow.AccountRepo.AddAsync(account);

            Customers customer = new Customers()
            {
                CustomerId = account.AccountId,
                RoomId = request.RoomId
            };
            await _uow.CustomerRepo.AddAsync(customer);

            return $"The account is created";
        }
    }
}
