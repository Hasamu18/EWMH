using MediatR;
using Requests.Application.Queries;
using Requests.Application.ViewModels;
using Requests.Domain.Entities;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Handlers
{
    internal class GetRequestDetailHandler : IRequestHandler<GetRequestDetailQuery, (int, object)>
    {
        private readonly IUnitOfWork _uow;

        public GetRequestDetailHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, object)> Handle(GetRequestDetailQuery request, CancellationToken cancellationToken)
        {
            var getRequest = await _uow.RequestRepo.GetByIdAsync(request.RequestId);
            if (getRequest == null)
                return (404, "Yêu cầu không tồn tại");

            var result = new List<object>();
            var getCustomerAndLeader = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(getRequest.LeaderId) ||
                                                                  a.AccountId.Equals(getRequest.CustomerId))).ToList();
            result.Add(new
            {
                Request = getRequest,
                Customer_Leader = getCustomerAndLeader
            });

            if (getRequest.Status == 1 || getRequest.Status == 2)
            {
                var wokersList = new List<object>();
                var productsList = new List<object>();
                var getWorkers = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(getRequest.RequestId))).ToList();
                var getAttachedOrder = (await _uow.RequestDetailRepo.GetAsync(a => a.RequestId.Equals(getRequest.RequestId))).ToList();
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
                result.Add(new
                {
                    WorkerList = wokersList,
                    ProductList = productsList
                });
            }

            return (200, result);
        }
    }
}
