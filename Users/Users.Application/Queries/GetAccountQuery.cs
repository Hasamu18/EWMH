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
    public class GetAccountQuery : IRequest<TResponse<Account>>
    {
        public string Uid { get; set; }
        public GetAccountQuery(string uid)
        {
            Uid = uid;
        }
    }
}
