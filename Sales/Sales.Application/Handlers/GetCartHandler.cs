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
    public class GetCartHandler : IRequestHandler<GetCartQuery, (int, object)>
    {
        private readonly IUnitOfWork _uow;
        public GetCartHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, object)> Handle(GetCartQuery request, CancellationToken cancellationToken)
        {
            var existingCart = (await _uow.OrderRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                   a.Status == false)).ToList();
            if (existingCart.Count == 0)
                return (200, "Cart is empty");

            var cartDetail = (await _uow.OrderDetailRepo.GetAsync(a => a.OrderId.Equals(existingCart[0].OrderId))).ToList();
            var result = new List<object>();
            int totalPrice = 0;

            foreach (var item in cartDetail)
            {
                var existingProduct = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(item.ProductId),
                                                                       includeProperties: "ProductPrices")).ToList();
                var currentProduct = existingProduct[0].ProductPrices.OrderByDescending(p => p.Date).First();
                totalPrice += currentProduct.PriceByDate * item.Quantity; 

                result.Add(new
                {
                    existingProduct[0].ProductId,
                    existingProduct[0].Name,
                    existingProduct[0].ImageUrl,
                    currentProduct.PriceByDate,
                    item.Quantity
                });
            }

            result.Add(new
            {
                existingCart[0].OrderId,
                totalPrice
            });

            return (200, result);
        }
    }
}
