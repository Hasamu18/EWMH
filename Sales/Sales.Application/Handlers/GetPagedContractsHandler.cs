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
    internal class GetPagedContractsHandler : IRequestHandler<GetPagedContractsQuery, List<object>>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedContractsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<List<object>> Handle(GetPagedContractsQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<Contracts> items;
            var result = new List<object>();
            int count = 0;
            if (request.SearchByPhone == null && request.PurchaseTime_Des_Sort)
            {
                items = await _uow.ContractRepo.GetAsync(filter: c => c.OrderCode != 2, 
                                                         orderBy: s => s.OrderByDescending(d => d.PurchaseTime),
                                                         includeProperties: "ServicePackage",
                                                         pageIndex: request.PageIndex,
                                                         pageSize: request.Pagesize);
                count = (await _uow.ContractRepo.GetAsync(filter: c => c.OrderCode != 2)).Count();
            }
            else if (request.SearchByPhone == null && request.PurchaseTime_Des_Sort == false)
            {
                items = await _uow.ContractRepo.GetAsync(filter: c => c.OrderCode != 2, 
                                                         orderBy: s => s.OrderBy(d => d.PurchaseTime),
                                                         includeProperties: "ServicePackage",
                                                         pageIndex: request.PageIndex,
                                                         pageSize: request.Pagesize);
                count = (await _uow.ContractRepo.GetAsync(filter: c => c.OrderCode != 2)).Count();
            }
            else if (request.SearchByPhone != null && request.PurchaseTime_Des_Sort)
            {
                var customerIds = (await _uow.AccountRepo.GetAsync(c => c.PhoneNumber.Contains(request.SearchByPhone)))
                    .Select(c => c.AccountId)
                    .ToList();
                if (customerIds.Any())
                {
                    items = await _uow.ContractRepo.GetAsync(
                        filter: a => customerIds.Contains(a.CustomerId) && a.OrderCode != 2,
                        orderBy: s => s.OrderByDescending(d => d.PurchaseTime),
                        includeProperties: "ServicePackage",
                        pageIndex: request.PageIndex,
                        pageSize: request.Pagesize
                    );
                    count = items.Count();
                }
                else
                {
                    items = Enumerable.Empty<Contracts>();
                    count = 0;
                }
            }
            else
            {
                var customerIds = (await _uow.AccountRepo.GetAsync(c => c.PhoneNumber.Contains(request.SearchByPhone)))
                    .Select(c => c.AccountId)
                    .ToList();
                if (customerIds.Any())
                {
                    items = await _uow.ContractRepo.GetAsync(
                        filter: a => customerIds.Contains(a.CustomerId) && a.OrderCode != 2,
                        includeProperties: "ServicePackage",
                        orderBy: s => s.OrderBy(d => d.PurchaseTime),
                        pageIndex: request.PageIndex,
                        pageSize: request.Pagesize
                    );
                    count = items.Count();
                }
                else
                {
                    items = Enumerable.Empty<Contracts>();
                    count = 0;
                }
            }

            foreach (var item in items)
            {
                var getCusInfo = await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(item.CustomerId),
                                                                 includeProperties: "Customers");

                result.Add(new
                {
                    Item = new
                    {
                        item.ContractId,
                        item.CustomerId,
                        item.ServicePackageId,
                        item.ServicePackage.Name,
                        item.FileUrl,
                        item.PurchaseTime,
                        item.RemainingNumOfRequests,
                        item.OrderCode,
                        item.IsOnlinePayment,
                        item.TotalPrice
                    },
                    getCusInfo
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
