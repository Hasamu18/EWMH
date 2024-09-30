using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Mappers;
using Users.Application.Responses;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class UpdateAccountHandler : IRequestHandler<UpdateAccountCommand, TResponse<Account>>
    {
        private readonly IUnitOfWork _uow;
        public UpdateAccountHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<TResponse<Account>> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _uow.AccountRepo.GetFireStoreAsync(request.Uid);
            if (existingUser is null)
                return new TResponse<Account>
                {
                    Message = "The user does not exist",
                    Response = null
                };

            var account = UserMapper.Mapper.Map<Account>(existingUser);
            account.DisplayName = request.DisplayName;
            var userInfo = await _uow.AccountRepo.UpdateFireStoreAsync(account.Uid, account);

            return new TResponse<Account>
            {
                Message = "Update successfully",
                Response = userInfo
            };
        }
    }
}
