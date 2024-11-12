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
    internal class GetAllPendingContractsHandler : IRequestHandler<GetAllPendingContractsQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetAllPendingContractsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetAllPendingContractsQuery request, CancellationToken cancellationToken)
        {
            var getPendingContracts = (await _uow.ContractRepo.GetAsync(a => a.OrderCode == 2, includeProperties: "ServicePackage.ServicePackagePrices")).ToList();
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
