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
    public class GetAccountHandler : IRequestHandler<GetAccountQuery, TResponse<Accounts>>
    {
        private readonly IUnitOfWork _uow;
        public GetAccountHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }
        public async Task<TResponse<Accounts>> Handle(GetAccountQuery request, CancellationToken cancellationToken)
        {
            var existingUser = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(request.AccountId))).ToList();
            if (existingUser.Any())
                return new TResponse<Accounts>
                {
                    Message = "Get account successfully",
                    Response = existingUser[0]
                };

            return new TResponse<Accounts>
            {
                Message = "The user does not exist",
                Response = null
            };
        }

    }
}
