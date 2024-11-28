using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    public class GetContractAndRequestsQuery : IRequest<object>
    {
        public required string ContractId { get; set; }
    }
}
