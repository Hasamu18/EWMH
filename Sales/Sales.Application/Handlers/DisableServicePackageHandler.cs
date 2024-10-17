using MediatR;
using Microsoft.Extensions.Configuration;
using Sales.Application.Commands;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    public class DisableServicePackageHandler : IRequestHandler<DisableServicePackageCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public DisableServicePackageHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(DisableServicePackageCommand request, CancellationToken cancellationToken)
        {
            var existingServicePackage = (await _uow.ServicePackageRepo.GetAsync(a => a.ServicePackageId.Equals(request.ServicePackageId))).ToList();
            if (existingServicePackage.Count == 0)
                return (404, "Service package does not exist");

            existingServicePackage[0].Status = request.Status;
            await _uow.ServicePackageRepo.UpdateAsync(existingServicePackage[0]);

            if (request.Status)
                return (200, $"{existingServicePackage[0].Name} has been disabled");
            return (200, $"{existingServicePackage[0].Name} has been activated");
        }
    }
}
