using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Queries;
using Users.Application.Responses;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class GetAccountHandler : IRequestHandler<GetAccountQuery, TResponse<Account>>
    {
        private readonly IUnitOfWork _uow;
        public GetAccountHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }
        public async Task<TResponse<Account>> Handle(GetAccountQuery request, CancellationToken cancellationToken)
        {
            var existingUser = await _uow.AccountRepo.GetFireStoreAsync(request.Uid);
            if (existingUser is not null)
                return new TResponse<Account>
                {
                    Message = "Get account successfully",
                    Response = existingUser
                };

            return new TResponse<Account>
            {
                Message = "The user does not exist",
                Response = null
            };
        }

    }
}
