using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sales.Application.Queries;
using Sales.Domain.IRepositories;
using Users.Application.Queries;
using Sales.Domain.Entities;

namespace Users.Application.Handlers
{
    internal class GetContractsOfCustomerHandler : IRequestHandler<GetContractsOfCustomerQuery, (int, object)>
    {
        private readonly IUnitOfWork _uow;
        public GetContractsOfCustomerHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, object)> Handle(GetContractsOfCustomerQuery request, CancellationToken cancellationToken)
        {
            var getCustomer = await _uow.AccountRepo.GetByIdAsync(request.CustomerId);
            if (getCustomer == null)
                return (404, "Khách hàng không tồn tại");

            List<Contracts> items;
            if (request.StartDate == null && request.EndDate == null)
            {
                items = (await _uow.ContractRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                     a.PurchaseTime != null,
                                                                     includeProperties: "Requests")).ToList();
            }
            else if (request.StartDate == null && request.EndDate != null)
            {
                items = (await _uow.ContractRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                     a.PurchaseTime != null &&
                                                                     DateOnly.FromDateTime((DateTime)a.PurchaseTime) == request.EndDate,
                                                                     includeProperties: "Requests")).ToList();
            }
            else if (request.StartDate != null && request.EndDate == null)
            {
                items = (await _uow.ContractRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                     a.PurchaseTime != null &&
                                                                     DateOnly.FromDateTime((DateTime)a.PurchaseTime) == request.StartDate,
                                                                     includeProperties: "Requests")).ToList();
            }
            else
            {
                items = (await _uow.ContractRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                     a.PurchaseTime != null &&
                                                                     DateOnly.FromDateTime((DateTime)a.PurchaseTime) >= request.StartDate &&
                                                                     DateOnly.FromDateTime((DateTime)a.PurchaseTime) <= request.EndDate,
                                                                     includeProperties: "Requests")).ToList();
            }

            return (200, items);
        }
    }
}
