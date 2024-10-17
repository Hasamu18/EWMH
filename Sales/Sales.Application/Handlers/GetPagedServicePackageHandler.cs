using MediatR;
using Sales.Application.Queries;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    public class GetPagedServicePackageHandler : IRequestHandler<GetPagedServicePackageQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedServicePackageHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetPagedServicePackageQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<ServicePackages> items;
            var result = new List<object>();
            if (request.SearchByName == null && request.Status == null)
            {
                items = await _uow.ServicePackageRepo.GetAsync(includeProperties: "ServicePackagePrices",
                                                               pageIndex: request.PageIndex,
                                                               pageSize: request.Pagesize);
            }
            else if (request.SearchByName == null && request.Status != null)
            {
                items = await _uow.ServicePackageRepo.GetAsync(filter: f => f.Status == request.Status,
                                                               includeProperties: "ServicePackagePrices",
                                                               pageIndex: request.PageIndex,
                                                               pageSize: request.Pagesize);
            }
            else if (request.SearchByName != null && request.Status == null)
            {
                items = await _uow.ServicePackageRepo.GetAsync(filter: f => f.Name.Contains(request.SearchByName),
                                                               includeProperties: "ServicePackagePrices",
                                                               pageIndex: request.PageIndex,
                                                               pageSize: request.Pagesize);
            }
            else
            {
                items = await _uow.ServicePackageRepo.GetAsync(filter: f => f.Name.Contains(request.SearchByName!) &&
                                                                            f.Status == request.Status,
                                                               includeProperties: "ServicePackagePrices",
                                                               pageIndex: request.PageIndex,
                                                               pageSize: request.Pagesize);
            }

            foreach (var item in items)
            {
                var currentServicePackage = item.ServicePackagePrices.OrderByDescending(p => p.Date).First();

                result.Add(new
                {
                    item.ServicePackageId,
                    item.Name,
                    item.NumOfRequest,
                    item.ImageUrl,
                    item.Description,
                    item.Status,
                    currentServicePackage.PriceByDate
                });
            }
            return result;
        }
    }
}
