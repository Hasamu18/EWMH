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
    internal class GetDesiredNumOfRequestsHandler : IRequestHandler<GetDesiredNumOfRequestsQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetDesiredNumOfRequestsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetDesiredNumOfRequestsQuery request, CancellationToken cancellationToken)
        {
            List<Requests.Domain.Entities.Requests> items = [];
            items = (await _uow.RequestRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId),
                    orderBy: s => s.OrderByDescending(d => d.Start),
                    pageIndex: 1,
                    pageSize: (int)request.Quantity)).ToList();
            
            var requestDetail = (await _uow.RequestDetailRepo.GetAsync()).ToList();
            return items;
        }
    }
}
