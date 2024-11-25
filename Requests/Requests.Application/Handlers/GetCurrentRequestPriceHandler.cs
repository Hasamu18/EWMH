using MediatR;
using Requests.Application.Queries;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Handlers
{
    internal class GetCurrentRequestPriceHandler : IRequestHandler<GetCurrentRequestPriceQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetCurrentRequestPriceHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetCurrentRequestPriceQuery request, CancellationToken cancellationToken)
        {
            var getRequestPrice = (await _uow.PriceRequestRepo.GetAsync()).OrderByDescending(o => o.Date).First().PriceByDate;
            return new
            {
                getRequestPrice
            };
        }
    }
}
