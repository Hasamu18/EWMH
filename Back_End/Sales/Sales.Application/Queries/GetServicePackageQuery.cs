using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetServicePackageQuery : IRequest<(int, object)>
    {
        public required string ServicePackageId { get; set; }
    }
}
