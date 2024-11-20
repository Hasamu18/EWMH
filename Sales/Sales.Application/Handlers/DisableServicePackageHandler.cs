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
                return (404, "Gói dịch vụ không tồn tại");

            existingServicePackage[0].Status = request.Status;
            await _uow.ServicePackageRepo.UpdateAsync(existingServicePackage[0]);

            if (request.Status)
                return (200, $"Gói dịch vụ: {existingServicePackage[0].Name} đã bị vô hiệu hóa");
            return (200, $"Gói dịch vụ: {existingServicePackage[0].Name} đã được kích hoạt");
        }
    }
}
