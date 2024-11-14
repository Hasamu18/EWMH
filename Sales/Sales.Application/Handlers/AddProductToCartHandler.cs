using Logger.Utility;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Sales.Application.Commands;
using Sales.Application.Mappers;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    public class AddProductToCartHandler : IRequestHandler<AddProductToCartCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public AddProductToCartHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(AddProductToCartCommand request, CancellationToken cancellationToken)
        {
            var existingProduct = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(request.ProductId))).ToList();
            if (existingProduct.Count == 0)
                return (404, "Product does not exist");

            if (request.Quantity > existingProduct[0].InOfStock)
                return (409, "This product is not available in sufficient quantity");

            var existingCart = (await _uow.OrderRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                   a.Status == false)).ToList();
            if (existingCart.Count == 0)
            {
                var orderId = $"O_{Tools.GetDynamicTimeZone():yyyyMMddHHmmss}_{request.CustomerId}";
                Orders order = new()
                {
                    OrderId = orderId,
                    CustomerId = request.CustomerId,
                    PurchaseTime = null,
                    Status = false,
                    FileUrl = null,
                    OrderCode = null
                };
                await _uow.OrderRepo.AddAsync(order);

                OrderDetails orderDetail = new()
                {
                    OrderId = orderId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    Price = 0,
                    TotalPrice = 0
                };
                await _uow.OrderDetailRepo.AddAsync(orderDetail);
            }
            else
            {
                var existingProductInCart = (await _uow.OrderDetailRepo.GetAsync(a => a.OrderId.Equals(existingCart[0].OrderId) &&
                                                                                 a.ProductId.Equals(request.ProductId))).ToList();
                if ( existingProductInCart.Count == 0)
                {
                    OrderDetails orderDetail = new()
                    {
                        OrderId = existingCart[0].OrderId,
                        ProductId = request.ProductId,
                        Quantity = request.Quantity,
                        Price = 0,
                        TotalPrice = 0
                    };
                    await _uow.OrderDetailRepo.AddAsync(orderDetail);
                }
                else
                {
                    existingProductInCart[0].Quantity = request.Quantity;
                    await _uow.OrderDetailRepo.UpdateAsync(existingProductInCart[0]);
                }
            }
            return (201, "Added product to cart");
        }
    }
}
