using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Requests.Application.Queries;
using Requests.Domain.IRepositories;
using Requests.Domain.Entities;


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
            var request = (await _uow.RequestRepo.GetAsync(a => a.RequestId.Equals(_query.RequestId))).ToList().First();
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
            var getRequestPrice = (await _uow.PriceRequestRepo.GetAsync()).ToList();
            
            Contracts? contract = null;
            if (request.ContractId != null)
            {
                contract = (await _uow.ContractRepo.GetAsync(a => (a.ContractId ?? "").Equals(request.ContractId), includeProperties: "ServicePackage")).First();
            }
            
            if (request.Status == 1 || request.Status == 2)
            {
                var getWorkers = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(request.RequestId))).ToList();
                var getAttachedOrder = (await _uow.RequestDetailRepo.GetAsync(a => a.RequestId.Equals(request.RequestId))).ToList();             
                foreach (var worker in getWorkers)
                {
                    var getWokerInfo = await _uow.AccountRepo.GetByIdAsync(worker.WorkerId);
                    wokersList.Add(new
                    {
                        getWokerInfo = getWokerInfo!,
                        worker.IsLead
                    });
                }
                foreach (var product in getAttachedOrder)
                {
                    var getProductInfo = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(product.ProductId),
                                                                   includeProperties: "ProductPrices")).ToList();
                    int currentPriceProduct = getProductInfo[0].ProductPrices
                    .OrderByDescending(p => p.Date)
                    .FirstOrDefault(p => request.Start >= p.Date)?.PriceByDate
                    ?? getProductInfo[0].ProductPrices.Last().PriceByDate;

                    if (!product.IsCustomerPaying)
                        currentPriceProduct = 0;
                    
                    productsList.Add(new
                    {
                        getProductInfo[0].ProductId,
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
                Request = new
                {
                    request.RequestId,
                    request.LeaderId,
                    request.CustomerId,
                    request.ContractId,
                    request.RoomId,
                    request.Start,
                    request.End,
                    request.CustomerProblem,
                    request.Conclusion,
                    request.Status,
                    request.CategoryRequest,
                    request.PurchaseTime,
                    request.TotalPrice,
                    request.FileUrl,
                    request.PreRepairEvidenceUrl,
                    request.PostRepairEvidenceUrl,
                    request.OrderCode,
                    request.IsOnlinePayment,
                    requestPrice = request.CategoryRequest == 0
                    ? 0
                    : request.CategoryRequest == 1 && request.ContractId != null
                        ? 0
                        : (getRequestPrice
                           .OrderByDescending(p => p.Date)
                           .FirstOrDefault(p => request.Start >= p.Date) ?? request.PriceRequests.Last()).PriceByDate
                },
                Customer_Leader = getCustomerAndLeader,
                WorkerList = wokersList,
                ProductList = productsList,
                Contract = contract == null ? null : new
                {
                    contract.ContractId,
                    contract.CustomerId,
                    contract.ServicePackageId,
                    contract.ServicePackage.Name,
                    contract.ServicePackage.NumOfRequest,
                    contract.FileUrl,
                    contract.PurchaseTime,
                    ExpireDate = contract.PurchaseTime!.Value.AddYears(2),
                    contract.RemainingNumOfRequests,
                    contract.OrderCode,
                    contract.IsOnlinePayment,
                    contract.TotalPrice
                }
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
