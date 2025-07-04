﻿using MediatR;
using Sales.Application.Commands;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    internal class DeleteProductToCartHandler : IRequestHandler<DeleteProductToCartCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public DeleteProductToCartHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(DeleteProductToCartCommand request, CancellationToken cancellationToken)
        {
            var existingProduct = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(request.ProductId))).ToList();
            if (existingProduct.Count == 0)
                return (404, "Sản phẩm không tồn tại");

            var existingCart = (await _uow.OrderRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                   a.Status == false)).ToList();
            if (existingCart.Count == 0)
                return (404, "Giỏ hàng trống");

            var cartDetail = (await _uow.OrderDetailRepo.GetAsync(a => a.OrderId.Equals(existingCart[0].OrderId) &&
                                                                  a.ProductId.Equals(request.ProductId))).ToList();
            if (cartDetail.Count == 0)
                return (404, "Sản phẩm này hiện không có trong giỏ hàng của bạn");

            await _uow.OrderDetailRepo.RemoveAsync(cartDetail[0]);

            var currentCartDetail = (await _uow.OrderDetailRepo.GetAsync(a => a.OrderId.Equals(existingCart[0].OrderId))).ToList();
            if (currentCartDetail.Count == 0)
                await _uow.OrderRepo.RemoveAsync(existingCart[0]);

            return (200, "Sản phẩm đã bị xóa khỏi giỏ hành của bạn");
        }
    }
}
