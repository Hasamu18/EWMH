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
    internal class GetRequestsHandler : IRequestHandler<GetRequestsQuery, List<object>>
    {
        private readonly IUnitOfWork _uow;
        public GetRequestsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<List<object>> Handle(GetRequestsQuery request, CancellationToken cancellationToken)
        {
            List<Requests.Domain.Entities.Requests> requestList = [];
            var result = new List<object>();
            if (request.Status == null && request.StartDate == null)
            {
                requestList = (await _uow.RequestRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId), 
                    orderBy: o => o.OrderByDescending(s => s.Start))).ToList();
            }
            else if (request.Status == null && request.StartDate != null)
            {
                requestList = (await _uow.RequestRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId) &&
                                                               DateOnly.FromDateTime(a.Start) == request.StartDate,
                    orderBy: o => o.OrderByDescending(s => s.Start))).ToList();
            }
            else if (request.Status != null && request.StartDate == null)
            {
                requestList = (await _uow.RequestRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId) &&
                                                               a.Status == (int)request.Status,
                    orderBy: o => o.OrderByDescending(s => s.Start))).ToList();
            }
            else
            {
                requestList = (await _uow.RequestRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId) &&
                                                               a.Status == (int)request.Status! &&
                                                               DateOnly.FromDateTime(a.Start) == request.StartDate,
                    orderBy: o => o.OrderByDescending(s => s.Start))).ToList();
            }

            foreach (var get in requestList)
            {
                var getApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.LeaderId.Equals(get.LeaderId))).First();
                var getCustomer = await _uow.AccountRepo.GetByIdAsync(get.CustomerId);
                result.Add(new
                {
                    get,
                    getCustomer,
                    getApartment
                });
            }

            return result;
        }
    }
}
