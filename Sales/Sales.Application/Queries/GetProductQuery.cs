using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Queries
{
    public class GetProductQuery : IRequest<(int, object)>
    {
        public required string ProductId { get; set; }
    }
}
