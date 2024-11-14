using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Requests.Application.Queries;
using Requests.Domain.IRepositories;


namespace Requests.Application.Handlers
{
    internal class GetManagerRequestDetailsHandler : IRequestHandler<GetManagerRequestDetailsQuery, object>
    {
        private readonly IUnitOfWork _uow;
        private GetManagerRequestDetailsQuery _query;
        public GetManagerRequestDetailsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetManagerRequestDetailsQuery query, CancellationToken cancellationToken)
        {
            _query = query;
            var request = await _uow.RequestRepo.GetByIdAsync(_query.RequestId);
            var customerAndLeaderPair = await GetCustomerLeaderPair(request);

            //else
            //{
            //    items = await _uow.RequestRepo.GetAsync(a => a.Status == (int)request.Status,
            //                                        orderBy: s => s.OrderByDescending(o => o.Start),
            //                                        pageIndex: request.PageIndex,
            //                                        pageSize: request.Pagesize);
            //    count = (await _uow.RequestRepo.GetAsync(a => a.Status == (int)request.Status)).Count();
            //}            


            var getCustomerAndLeader = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(request.LeaderId) ||
                                                              a.AccountId.Equals(request.CustomerId))).ToList();
            var wokersList = new List<object>();
            var productsList = new List<object>();
            if (request.Status == 1 || request.Status == 2)
            {
                var getWorkers = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(request.RequestId))).ToList();
                var getAttachedOrder = (await _uow.RequestDetailRepo.GetAsync(a => a.RequestId.Equals(request.RequestId))).ToList();
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
            return new
            {
                Request = request,
                Customer_Leader = getCustomerAndLeader,
                WorkerList = wokersList,
                ProductList = productsList
            };

        }
        private async Task<List<Domain.Entities.Accounts>> GetCustomerLeaderPair(Domain.Entities.Requests request)
        {

            var result = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(request.LeaderId) ||
                                                              a.AccountId.Equals(request.CustomerId))).ToList();
            return result;
        }

    }
}
