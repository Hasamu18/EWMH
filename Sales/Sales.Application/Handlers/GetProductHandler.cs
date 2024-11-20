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
    public class GetProductHandler : IRequestHandler<GetProductQuery, (int, object)>
    {
        private readonly IUnitOfWork _uow;
        public GetProductHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, object)> Handle(GetProductQuery request, CancellationToken cancellationToken)
        {
            var existingProduct = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(request.ProductId),
                                                                   includeProperties: "ProductPrices")).ToList();
            if (existingProduct.Count == 0)
                return (404, "Sản phẩm không tồn tại");

            var currentProduct = existingProduct[0].ProductPrices.OrderByDescending(p => p.Date).First();

            return (200, new
            {
                existingProduct[0].ProductId,
                existingProduct[0].Name,
                existingProduct[0].Description,
                existingProduct[0].ImageUrl,
                existingProduct[0].InOfStock,
                existingProduct[0].WarantyMonths,
                existingProduct[0].Status,
                currentProduct.ProductPriceId,
                currentProduct.Date,
                currentProduct.PriceByDate
            });
        }
    }
}
