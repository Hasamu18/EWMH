using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetAllExpireContractsQuery : IRequest<object>
    {
        public string LeaderId { get; set; }
        public string? Phone { get; set; }

        public GetAllExpireContractsQuery(string leaderId, string? phone)
        {
            LeaderId = leaderId;
            Phone = phone;
        }
    }
}
