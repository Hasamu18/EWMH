using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetAllStillValidContractsQuery : IRequest<object>
    {
        public string LeaderId { get; set; }
        public string? Phone { get; set; }

        public GetAllStillValidContractsQuery(string leaderId, string? phone)
        {
            LeaderId = leaderId;
            Phone = phone;
        }
    }
}
