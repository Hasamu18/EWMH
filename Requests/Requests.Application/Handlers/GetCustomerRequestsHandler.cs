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
    internal class GetCustomerRequestsHandler : IRequestHandler<GetCustomerRequestsQuery, List<object>>
    {
        private readonly IUnitOfWork _uow;
        public GetCustomerRequestsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<List<object>> Handle(GetCustomerRequestsQuery request, CancellationToken cancellationToken)
        {
            List<Requests.Domain.Entities.Requests> requestList = [];
            var result = new List<object>();
            if (request.Status == null && request.StartDate == null)
            {
                requestList = (await _uow.RequestRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId))).ToList();
            }
            else if (request.Status == null && request.StartDate != null)
            {
                requestList = (await _uow.RequestRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                               DateOnly.FromDateTime(a.Start) == request.StartDate)).ToList();
            }
            else if (request.Status != null && request.StartDate == null)
            {
                requestList = (await _uow.RequestRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                               a.Status == request.Status)).ToList();
            }
            else
            {
                requestList = (await _uow.RequestRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                               a.Status == request.Status &&
                                                               DateOnly.FromDateTime(a.Start) == request.StartDate)).ToList();
            }

            foreach (var get in requestList)
            {
                var getCustomer = await _uow.AccountRepo.GetByIdAsync(get.CustomerId);
                result.Add(new
                {
                    get,
                    getCustomer,
                });
            }

            return result;
        }
    }
}
