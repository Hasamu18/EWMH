using MediatR;
using Sales.Application.Queries;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    public class GetPagedProductHandler : IRequestHandler<GetPagedProductQuery, List<object>>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedProductHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<List<object>> Handle(GetPagedProductQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<Products> items;
            var result = new List<object>();
            int count = 0;
            if (request.SearchByName == null && request.Status == null && request.InOfStock_Sort)
            {
                items = await _uow.ProductRepo.GetAsync(orderBy: s => s.OrderBy(o => o.InOfStock),
                                                        includeProperties: "ProductPrices",
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.ProductRepo.GetAsync(orderBy: s => s.OrderBy(o => o.InOfStock))).Count();

            }
            else if (request.SearchByName == null && request.Status == null && !request.InOfStock_Sort)
            {
                items = await _uow.ProductRepo.GetAsync(orderBy: s => s.OrderByDescending(o => o.InOfStock),
                                                        includeProperties: "ProductPrices",
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.ProductRepo.GetAsync(orderBy: s => s.OrderByDescending(o => o.InOfStock))).Count();

            }
            else if (request.SearchByName == null && request.Status != null && request.InOfStock_Sort)
            {
                items = await _uow.ProductRepo.GetAsync(filter: f => f.Status == request.Status,
                                                        orderBy: s => s.OrderBy(o => o.InOfStock),
                                                        includeProperties: "ProductPrices",
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.ProductRepo.GetAsync(filter: f => f.Status == request.Status,
                                                        orderBy: s => s.OrderBy(o => o.InOfStock))).Count();

            }
            else if (request.SearchByName == null && request.Status != null && !request.InOfStock_Sort)
            {
                items = await _uow.ProductRepo.GetAsync(filter: f => f.Status == request.Status,
                                                        orderBy: s => s.OrderByDescending(o => o.InOfStock),
                                                        includeProperties: "ProductPrices", 
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.ProductRepo.GetAsync(filter: f => f.Status == request.Status,
                                                        orderBy: s => s.OrderByDescending(o => o.InOfStock))).Count();

            }
            else if (request.SearchByName != null && request.Status == null && request.InOfStock_Sort)
            {
                items = await _uow.ProductRepo.GetAsync(filter: f => f.Name.Contains(request.SearchByName),
                                                        orderBy: s => s.OrderBy(o => o.InOfStock),
                                                        includeProperties: "ProductPrices",
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.ProductRepo.GetAsync(filter: f => f.Name.Contains(request.SearchByName),
                                                        orderBy: s => s.OrderBy(o => o.InOfStock))).Count();

            }
            else if (request.SearchByName != null && request.Status == null && !request.InOfStock_Sort)
            {
                items = await _uow.ProductRepo.GetAsync(filter: f => f.Name.Contains(request.SearchByName),
                                                        orderBy: s => s.OrderByDescending(o => o.InOfStock),
                                                        includeProperties: "ProductPrices",
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.ProductRepo.GetAsync(filter: f => f.Name.Contains(request.SearchByName),
                                                        orderBy: s => s.OrderByDescending(o => o.InOfStock))).Count();
   
            }
            else if (request.SearchByName != null && request.Status != null && request.InOfStock_Sort)
            {
                items = await _uow.ProductRepo.GetAsync(filter: f => f.Name.Contains(request.SearchByName) &&
                                                                     f.Status == request.Status,
                                                        orderBy: s => s.OrderBy(o => o.InOfStock),
                                                        includeProperties: "ProductPrices",
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.ProductRepo.GetAsync(filter: f => f.Name.Contains(request.SearchByName) &&
                                                                     f.Status == request.Status,
                                                        orderBy: s => s.OrderBy(o => o.InOfStock))).Count();
       
            }
            else
            {
                items = await _uow.ProductRepo.GetAsync(filter: f => f.Name.Contains(request.SearchByName!) &&
                                                                     f.Status == request.Status,
                                                        orderBy: s => s.OrderByDescending(o => o.InOfStock),
                                                        includeProperties: "ProductPrices",
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.ProductRepo.GetAsync(filter: f => f.Name.Contains(request.SearchByName!) &&
                                                                     f.Status == request.Status,
                                                        orderBy: s => s.OrderByDescending(o => o.InOfStock))).Count();
 
            }

            foreach (var item in items)
            {
                var currentProduct = item.ProductPrices.OrderByDescending(p => p.Date).First();

                result.Add(new
                {
                    item.ProductId,
                    item.Name,
                    item.InOfStock,
                    item.ImageUrl,
                    item.Status,
                    currentProduct.PriceByDate
                });
            }
            return new()
            {
                result,
                count
            };
        }
    }
}
