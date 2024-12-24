using Logger.Utility;
using MediatR;
using Sales.Application.Queries;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Google.Cloud.Firestore.V1.StructuredQuery.Types;

namespace Sales.Application.Handlers
{
    internal class GetOrderDetailsHandler : IRequestHandler<GetOrderDetailsQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetOrderDetailsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetOrderDetailsQuery request, CancellationToken cancellationToken)
        {
            var result = new List<object>();
            var getOrderDetail = (await _uow.OrderDetailRepo.GetAsync(a => a.OrderId.Equals(request.OrderId),
                                                                      includeProperties: "Product")).ToList();
            if (getOrderDetail.Count == 0)
                return result;

            ApartmentAreas? apartment = null;
            Accounts? leader = null;
            var order = await _uow.OrderRepo.GetByIdAsync(getOrderDetail[0].OrderId);
            var customer = await _uow.AccountRepo.GetByIdAsync(order!.CustomerId);
            var getShipping = await _uow.ShippingRepo.GetByIdAsync(order.OrderId);
            var getAreaId = (await _uow.RoomRepo.GetAsync(a => (a.CustomerId ?? "").Equals(order!.CustomerId))).ToList();

            if (getAreaId.Count != 0)
            {
                apartment = await _uow.ApartmentAreaRepo.GetByIdAsync(getAreaId[0].AreaId);
                leader = await _uow.AccountRepo.GetByIdAsync(apartment!.LeaderId);
            }

            foreach (var orderDetail in getOrderDetail)
            {
                var product = await _uow.ProductRepo.GetByIdAsync(orderDetail.ProductId);
                var getWarrantyCards = (await _uow.WarrantyCardRepo.GetAsync(a => a.StartDate == order.PurchaseTime &&
                                                                             a.ProductId.Equals(orderDetail.ProductId) &&
                                                                             a.CustomerId.Equals(customer!.AccountId))).ToList();
                result.Add(new
                {
                    Product = new
                    {
                        product!.ProductId,
                        product.Name,
                        product.ImageUrl,
                        product.Description,
                        product.WarantyMonths
                    },
                    OrderDetail = new
                    {
                        orderDetail.OrderId,
                        orderDetail.ProductId,
                        orderDetail.Quantity,
                        orderDetail.Price,
                        orderDetail.TotalPrice,
                        WarrantyCards = new
                        {
                            getWarrantyCards,
                            RemainingDays = getWarrantyCards.Select(card =>Math.Max(0, Math.Round((card.ExpireDate - Tools.GetDynamicTimeZone()).TotalDays)))
                        }
                    }
                });
            }

            return new
            {
                Customer = new
                {
                    customer!.AccountId,
                    customer!.FullName,
                    customer.PhoneNumber,
                    customer.Email,
                    customer.AvatarUrl,
                    customer.DateOfBirth,
                    Shipping = getShipping
                },
                Apartment = apartment,
                Leader = leader,
                Order = new
                {
                    result,
                    Sum = getOrderDetail.Select(s => s.TotalPrice).Sum(),
                    order.PurchaseTime,
                    order.FileUrl
                }
            };
        }
    }
}
