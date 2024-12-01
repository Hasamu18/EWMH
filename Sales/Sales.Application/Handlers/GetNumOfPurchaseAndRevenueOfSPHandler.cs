using MediatR;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Sales.Application.Queries;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    internal class GetNumOfPurchaseAndRevenueOfSPHandler : IRequestHandler<GetNumOfPurchaseAndRevenueOfSPQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetNumOfPurchaseAndRevenueOfSPHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetNumOfPurchaseAndRevenueOfSPQuery request, CancellationToken cancellationToken)
        {
            var result = new List<object>();
            if (request.NumOfTop != null && request.ServicePackageId == null)
            {
                var getContracts = (await _uow.ContractRepo.GetAsync(a => a.OrderCode != 2)).ToArray();

                var contractsGroup = getContracts.GroupBy(g => g.ServicePackageId)
                                                 .Select(group => new
                                                 {
                                                     ServicePackageId = group.Key,
                                                     TotalQuantity = group.Count(),
                                                     TotalPrice = group.Sum(d => d.TotalPrice),
                                                     ContractIds = group.Select(d => new
                                                     {
                                                         d.ContractId,
                                                         getContracts.First(o => o.ContractId == d.ContractId).PurchaseTime
                                                     }).Distinct().ToList()
                                                 })
                                                 .OrderByDescending(o => o.TotalQuantity)
                                                 .Take((int)request.NumOfTop).ToList();

                var spIds = contractsGroup.Select(g => g.ServicePackageId).ToList();
                var spsInfo = (await _uow.ServicePackageRepo.GetAsync(p => spIds.Contains(p.ServicePackageId), includeProperties: "ServicePackagePrices")).ToList();

                result.Add(contractsGroup.Select(group =>
                {
                    var spInfo = spsInfo.FirstOrDefault(p => p.ServicePackageId == group.ServicePackageId);
                    var latestPrice = spInfo?.ServicePackagePrices.OrderByDescending(d => d.Date).First().PriceByDate;
                    return new
                    {
                        group.ServicePackageId,
                        TotalPurchasedQuantity = group.TotalQuantity,
                        TotalRevenue = group.TotalPrice,
                        ServicePackageName = spInfo?.Name,
                        ServicePackageDescription = spInfo?.Description,
                        ServicePackageImageUrl = spInfo?.ImageUrl,
                        spInfo?.NumOfRequest,
                        spInfo?.Policy,
                        spInfo?.Status,
                        latestPrice,
                        ContractIdList = group.ContractIds.OrderByDescending(d => d.PurchaseTime)
                    };
                }).ToList());
            }
            else if ((request.NumOfTop != null && request.ServicePackageId != null) ||
                     (request.NumOfTop == null && request.ServicePackageId != null))
            {
                var getContracts = (await _uow.ContractRepo.GetAsync(a => a.OrderCode != 2)).ToArray();

                var contractsGroup = getContracts.Where(g => g.ServicePackageId.Equals(request.ServicePackageId))
                                                 .GroupBy(g => g.ServicePackageId)
                                                 .Select(group => new
                                                 {
                                                     ServicePackageId = group.Key,
                                                     TotalQuantity = group.Count(),
                                                     TotalPrice = group.Sum(d => d.TotalPrice),
                                                     ContractIds = group.Select(d => new
                                                     {
                                                         d.ContractId,
                                                         getContracts.First(o => o.ContractId == d.ContractId).PurchaseTime
                                                     }).Distinct().ToList()
                                                 })
                                                 .OrderByDescending(o => o.TotalQuantity);

                var spIds = contractsGroup.Select(g => g.ServicePackageId).ToList();
                var spsInfo = (await _uow.ServicePackageRepo.GetAsync(p => spIds.Contains(p.ServicePackageId), includeProperties: "ServicePackagePrices")).ToList();

                result.Add(contractsGroup.Select(group =>
                {
                    var spInfo = spsInfo.FirstOrDefault(p => p.ServicePackageId == group.ServicePackageId);
                    var latestPrice = spInfo?.ServicePackagePrices.OrderByDescending(d => d.Date).First().PriceByDate;
                    return new
                    {
                        group.ServicePackageId,
                        TotalPurchasedQuantity = group.TotalQuantity,
                        TotalRevenue = group.TotalPrice,
                        ServicePackageName = spInfo?.Name,
                        ServicePackageDescription = spInfo?.Description,
                        ServicePackageImageUrl = spInfo?.ImageUrl,
                        spInfo?.NumOfRequest,
                        spInfo?.Policy,
                        spInfo?.Status,
                        latestPrice,
                        ContractIdList = group.ContractIds.OrderByDescending(d => d.PurchaseTime)
                    };
                }).ToList());
            }
            else return result;

            return result;
        }
    }
}
