using Logger.Utility;
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
    internal class GetCurrentRequestsHandler : IRequestHandler<GetCurrentRequestsQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetCurrentRequestsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetCurrentRequestsQuery request, CancellationToken cancellationToken)
        {
            var result = new List<object>();
            var items = await _uow.RequestRepo.GetAsync(filter: a => a.Start.Date == Tools.GetDynamicTimeZone().Date,
                                                orderBy: s => s.OrderByDescending(o => o.Start),
                                                pageIndex: request.PageIndex,
                                                pageSize: request.Pagesize);
            int count = (await _uow.RequestRepo.GetAsync(a => a.Start.Date == Tools.GetDynamicTimeZone().Date)).Count();

            foreach (var item in items)
            {
                var getCustomerAndLeader = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(item.LeaderId) ||
                                                                  a.AccountId.Equals(item.CustomerId))).ToList();
                var wokersList = new List<object>();
                var productsList = new List<object>();
                if (item.Status == 1 || item.Status == 2)
                {
                    var getWorkers = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(item.RequestId))).ToList();
                    var getAttachedOrder = (await _uow.RequestDetailRepo.GetAsync(a => a.RequestId.Equals(item.RequestId))).ToList();
                    foreach (var worker in getWorkers)
                    {
                        var getWokerInfo = await _uow.AccountRepo.GetByIdAsync(worker.WorkerId);
                        wokersList.Add(getWokerInfo!);
                    }
                    foreach (var product in getAttachedOrder)
                    {
                        var getProductInfo = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(product.ProductId),
                                                                       includeProperties: "ProductPrices")).ToList();
                        int currentPriceProduct = getProductInfo[0].ProductPrices.OrderByDescending(p => p.Date).First().PriceByDate;
                        if (!product.IsCustomerPaying)
                            currentPriceProduct = 0;

                        productsList.Add(new
                        {
                            getProductInfo[0].Name,
                            getProductInfo[0].ImageUrl,
                            Price = currentPriceProduct,
                            product.Quantity,
                            TotalPrice = currentPriceProduct * product.Quantity,
                            product.Description,
                            product.IsCustomerPaying
                        });
                    }
                }
                result.Add(new
                {
                    Request = item,
                    Customer_Leader = getCustomerAndLeader,
                    WorkerList = wokersList,
                    ProductList = productsList
                });
            }

            return new
            {
                result,
                count
            };
        }
    }
}
