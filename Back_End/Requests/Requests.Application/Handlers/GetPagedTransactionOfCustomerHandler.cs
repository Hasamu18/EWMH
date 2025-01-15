using MediatR;
using Requests.Application.Queries;
using Requests.Domain.Entities;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Handlers
{
    internal class GetPagedTransactionOfCustomerHandler : IRequestHandler<GetPagedTransactionOfCustomerQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedTransactionOfCustomerHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetPagedTransactionOfCustomerQuery request, CancellationToken cancellationToken)
        {
            var items = (await _uow.TransactionRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                     a.ServiceType == (int)request.ServiceType &&
                                                                     (!request.StartDate.HasValue || DateOnly.FromDateTime((DateTime)a.PurchaseTime) >= request.StartDate.Value) &&
                                                                     (!request.EndDate.HasValue || DateOnly.FromDateTime((DateTime)a.PurchaseTime) <= request.EndDate.Value),
                                                                     orderBy: o => o.OrderByDescending(s => s.PurchaseTime),
                                                                     pageIndex: request.PageIndex,
                                                                     pageSize: request.Pagesize)).ToList();
            return new
            {
                items,
                count = (await _uow.TransactionRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                     a.ServiceType == (int)request.ServiceType &&
                                                                     (!request.StartDate.HasValue || DateOnly.FromDateTime((DateTime)a.PurchaseTime) >= request.StartDate.Value) &&
                                                                     (!request.EndDate.HasValue || DateOnly.FromDateTime((DateTime)a.PurchaseTime) <= request.EndDate.Value),
                                                                     orderBy: o => o.OrderByDescending(s => s.PurchaseTime))).ToList().Count
            };
        }
    }
}
