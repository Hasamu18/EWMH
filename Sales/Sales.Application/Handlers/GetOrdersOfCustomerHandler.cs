using MediatR;
using Sales.Application.Queries;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    internal class GetOrdersOfCustomerHandler : IRequestHandler<GetOrdersOfCustomerQuery, (int, object)>
    {
        private readonly IUnitOfWork _uow;
        public GetOrdersOfCustomerHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, object)> Handle(GetOrdersOfCustomerQuery request, CancellationToken cancellationToken)
        {
            var getCustomer = await _uow.AccountRepo.GetByIdAsync(request.CustomerId);
            if (getCustomer == null)
                return (404, "Khách hàng không tồn tại");

            var result = new List<object>();
            if (request.StartDate == null && request.EndDate == null)
            {
                var getOrders = (await _uow.OrderRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                    a.Status == true, 
                                                                    includeProperties: "OrderDetails")).ToList();
                result.Add(getOrders);
            }
            else if (request.StartDate == null && request.EndDate != null)
            {
                var getOrders = (await _uow.OrderRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                    a.Status == true &&
                                                                    a.PurchaseTime != null &&
                                                                    DateOnly.FromDateTime((DateTime)a.PurchaseTime) == request.EndDate, 
                                                                    includeProperties: "OrderDetails")).ToList();
                result.Add(getOrders);
            }
            else if (request.StartDate != null && request.EndDate == null)
            {
                var getOrders = (await _uow.OrderRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                    a.Status == true &&
                                                                    a.PurchaseTime != null &&
                                                                    DateOnly.FromDateTime((DateTime)a.PurchaseTime) == request.StartDate,
                                                                    includeProperties: "OrderDetails")).ToList();
                result.Add(getOrders);
            }
            else
            {
                var getOrders = (await _uow.OrderRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                    a.Status == true &&
                                                                    a.PurchaseTime != null &&
                                                                    DateOnly.FromDateTime((DateTime)a.PurchaseTime) >= request.StartDate &&
                                                                    DateOnly.FromDateTime((DateTime)a.PurchaseTime) <= request.EndDate,
                                                                    includeProperties: "OrderDetails")).ToList();
                result.Add(getOrders);
            }
            return (200, result);
        }
    }
}
