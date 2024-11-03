using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetAllPendingContractsQuery : IRequest<object>
    {
        public string LeaderId { get; set; }

        public GetAllPendingContractsQuery(string leaderId)
        {
            LeaderId = leaderId;
        }
    }
}
