using MediatR;
using Sales.Application.Queries;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Google.Cloud.Firestore.V1.StructuredAggregationQuery.Types.Aggregation.Types;

namespace Sales.Application.Handlers
{
    internal class GetAllPendingContractsHandler : IRequestHandler<GetAllPendingContractsQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetAllPendingContractsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetAllPendingContractsQuery request, CancellationToken cancellationToken)
        {
            var getAreaId = (await _uow.ApartmentAreaRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId))).ToList().First().AreaId;
            var getCustomerIds = (await _uow.RoomRepo
                                .GetAsync(a => a.AreaId.Equals(getAreaId) && a.CustomerId != null))
                                .Select(a => a.CustomerId)
                                .ToList();
            IEnumerable<Contracts> getPendingContracts;
            if (request.Phone == null)
                getPendingContracts = (await _uow.ContractRepo.GetAsync(a => a.OrderCode == 2 && getCustomerIds.Contains(a.CustomerId), 
                    orderBy: o => o.OrderByDescending(p => p.PurchaseTime),
                    includeProperties: "ServicePackage.ServicePackagePrices")).ToList();
            else
            {
                var customerIds = (await _uow.AccountRepo.GetAsync(c => c.PhoneNumber.Contains(request.Phone)))
                    .Select(c => c.AccountId)
                    .ToList();
                if (customerIds.Any())
                {
                    getPendingContracts = (await _uow.ContractRepo.GetAsync(a => customerIds.Contains(a.CustomerId) && a.OrderCode == 2 && getCustomerIds.Contains(a.CustomerId),
                    orderBy: o => o.OrderByDescending(p => p.PurchaseTime),
                    includeProperties: "ServicePackage.ServicePackagePrices")).ToList();
                }
                else
                {
                    getPendingContracts = Enumerable.Empty<Contracts>();
                }                
            }
                           
            var result = new List<object>();
            foreach (var getPendingContract in getPendingContracts)
            {
                var getCusInfo = await _uow.AccountRepo.GetByIdAsync(getPendingContract.CustomerId);

                result.Add(new
                {
                    ContractId = getPendingContract.ContractId,
                    CustomerId = getPendingContract.CustomerId,
                    FileUrl = getPendingContract.FileUrl,
                    PurchaseTime = getPendingContract.PurchaseTime,
                    RemainingNumOfRequests = getPendingContract.RemainingNumOfRequests,
                    OrderCode = getPendingContract.OrderCode,
                    IsOnlinePayment = getPendingContract.IsOnlinePayment,
                    TotalPrice = getPendingContract.TotalPrice,
                    Customer = getCusInfo,
                    ServicePackage = new
                    {
                        Id = getPendingContract.ServicePackage.ServicePackageId,
                        Name = getPendingContract.ServicePackage.Name,
                        Description = getPendingContract.ServicePackage.Description,
                        ImageUrl = getPendingContract.ServicePackage.ImageUrl,
                        NumOfRequest = getPendingContract.ServicePackage.NumOfRequest,
                        Policy = getPendingContract.ServicePackage.Policy,
                        Status = getPendingContract.ServicePackage.Status,
                        Price = getPendingContract.ServicePackage.ServicePackagePrices.OrderByDescending(d => d.Date).First().PriceByDate
                    }
                });
            }

            return result;
        }
    }
}
