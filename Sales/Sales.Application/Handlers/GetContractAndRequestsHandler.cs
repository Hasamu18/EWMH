using MediatR;
using Sales.Application.Queries;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    internal class GetContractAndRequestsHandler : IRequestHandler<GetContractAndRequestsQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetContractAndRequestsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetContractAndRequestsQuery request, CancellationToken cancellationToken)
        {
            var item = (await _uow.ContractRepo.GetAsync(a => a.ContractId.Equals(request.ContractId),
                                                                     includeProperties: "Requests")).FirstOrDefault();
            
            Accounts? cusInfo = null;
            if (item != null) 
                cusInfo = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(item.CustomerId), includeProperties: "Customers")).First();

            return new
            {
                Contract = new
                {
                    item?.ContractId,
                    item?.CustomerId,
                    item?.ServicePackageId,
                    item?.FileUrl,
                    item?.PurchaseTime,
                    item?.RemainingNumOfRequests,
                    item?.OrderCode,
                    item?.IsOnlinePayment,
                    item?.TotalPrice
                },
                RequestIdList = item?.Requests.Select(s => new
                {
                    s.RequestId,
                    s.PurchaseTime
                }).OrderByDescending(o => o.PurchaseTime).ToArray(),
                CustomerInfo = new
                {
                    cusInfo?.AccountId,
                    cusInfo?.FullName,
                    cusInfo?.Email,
                    cusInfo?.PhoneNumber,
                    cusInfo?.AvatarUrl,
                    cusInfo?.DateOfBirth,
                    cusInfo?.IsDisabled,
                    cusInfo?.DisabledReason,
                    cusInfo?.Customers?.CMT_CCCD
                }
            };
        }
    }
}
