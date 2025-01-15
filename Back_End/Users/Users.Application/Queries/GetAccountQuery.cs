using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Responses;
using Users.Domain.Entities;

namespace Users.Application.Queries
{
    public class GetAccountQuery : IRequest<(int, TResponse<object>)>
    {
        public string AccountId { get; set; }
        public GetAccountQuery(string accountId)
        {
            AccountId = accountId;
        }
    }
}
