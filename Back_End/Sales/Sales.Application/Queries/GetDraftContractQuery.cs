using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetDraftContractQuery : IRequest<(int, object)>
    {
        public string CustomerId { get; set; }

        public string ServicePackageId { get; set; }

        public GetDraftContractQuery(string customerId, string servicePackageId)
        {
            CustomerId = customerId;
            ServicePackageId = servicePackageId;
        }
    }
}
