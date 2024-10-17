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
    public class GetServicePackageHandler : IRequestHandler<GetServicePackageQuery, (int, object)>
    {
        private readonly IUnitOfWork _uow;
        public GetServicePackageHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, object)> Handle(GetServicePackageQuery request, CancellationToken cancellationToken)
        {
            var existingServicePackage = (await _uow.ServicePackageRepo.GetAsync(a => a.ServicePackageId.Equals(request.ServicePackageId),
                                                                   includeProperties: "ServicePackagePrices")).ToList();
            if (existingServicePackage.Count == 0)
                return (404, "Service package does not exist");

            var currentServicePackage = existingServicePackage[0].ServicePackagePrices.OrderByDescending(p => p.Date).First();

            return (200, new
            {
                existingServicePackage[0].ServicePackageId,
                existingServicePackage[0].Name,
                existingServicePackage[0].Description,
                existingServicePackage[0].ImageUrl,
                existingServicePackage[0].NumOfRequest,
                existingServicePackage[0].Policy,
                existingServicePackage[0].Status,
                currentServicePackage.ServicePackagePriceId,
                currentServicePackage.Date,
                currentServicePackage.PriceByDate
            });
        }
    }
}
