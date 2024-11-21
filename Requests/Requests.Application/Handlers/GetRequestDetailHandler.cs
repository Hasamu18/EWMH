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
using static Google.Cloud.Firestore.V1.StructuredQuery.Types;

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
            var getRequestPrice = (await _uow.PriceRequestRepo.GetAsync()).ToList();
            var result = new List<object>();
            var getCustomerAndLeader = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(getRequest.LeaderId) ||
                                                                  a.AccountId.Equals(getRequest.CustomerId))).ToList();

            var getAreaId = (await _uow.RoomRepo.GetAsync(a => (a.CustomerId ?? "").Equals(getRequest.CustomerId))).ToList();
            var apartment = await _uow.ApartmentAreaRepo.GetByIdAsync(getAreaId[0].AreaId);
             
            var wokersList = new List<object>();
            var productsList = new List<object>();
            if (getRequest.Status == 1 || getRequest.Status == 2)
            {
               
                var getWorkers = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(getRequest.RequestId))).ToList();
                var getAttachedOrder = (await _uow.RequestDetailRepo.GetAsync(a => a.RequestId.Equals(getRequest.RequestId))).ToList();
                foreach (var worker in getWorkers)
                {
                    var getWokerInfo = await _uow.AccountRepo.GetByIdAsync(worker.WorkerId);
                    var getLead = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(request.RequestId) &&
                                                                         a.WorkerId.Equals(worker.WorkerId))).First();
                    wokersList.Add(new
                    {
                        workerInfo = getWokerInfo!,
                        getLead.IsLead
                    });
                }
                foreach (var product in getAttachedOrder)
                {
                    var getProductInfo = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(product.ProductId),
                                                                   includeProperties: "ProductPrices")).ToList();
                    int currentPriceProduct = getProductInfo[0].ProductPrices
                    .OrderByDescending(p => p.Date)
                    .FirstOrDefault(p => getRequest.Start >= p.Date)?.PriceByDate
                    ?? getProductInfo[0].ProductPrices.Last().PriceByDate;

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
                Request = new
                {
                    getRequest.RequestId,
                    getRequest.LeaderId,
                    getRequest.CustomerId,
                    getRequest.ContractId,
                    getRequest.RoomId,
                    getRequest.Start,
                    getRequest.End,
                    getRequest.CustomerProblem,
                    getRequest.Conclusion,
                    getRequest.Status,
                    getRequest.CategoryRequest,
                    getRequest.PurchaseTime,
                    getRequest.TotalPrice,
                    getRequest.FileUrl,
                    getRequest.OrderCode,
                    getRequest.IsOnlinePayment,
                    requestPrice = getRequest.CategoryRequest == 0
                    ? 0
                    : getRequest.CategoryRequest == 1 && getRequest.ContractId != null
                        ? 0
                        : (getRequestPrice
                           .OrderByDescending(p => p.Date)
                           .FirstOrDefault(p => getRequest.Start >= p.Date) ?? getRequest.PriceRequests.Last()).PriceByDate
                },
                Customer_Leader = getCustomerAndLeader,
                Apartment = new
                {
                    apartment!.Name,
                    apartment.AvatarUrl
                },
                WorkerList = wokersList,
                ProductList = productsList
            });

            return (200, result);
        }
    }
}
