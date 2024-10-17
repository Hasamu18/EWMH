using Logger.Utility;
using MediatR;
using Microsoft.Extensions.Configuration;
using Sales.Application.Commands;
using Sales.Application.Mappers;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    public class AddServicePackageHandler : IRequestHandler<AddServicePackageCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public AddServicePackageHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(AddServicePackageCommand request, CancellationToken cancellationToken)
        {
            var extensionFile = Path.GetExtension(request.Image.FileName);
            string[] extensionSupport = [".png", ".jpg"];
            if (!extensionSupport.Contains(extensionFile.ToLower()))
                return (400, "The avatar should be .png or .jpg");

            var servicePackageId = Tools.GenerateIdFormat32();
            var bucketAndPath = await _uow.ServicePackageRepo.UploadFileToStorageAsync(servicePackageId, request.Image, _config);
            var servicePackage = SaleMapper.Mapper.Map<ServicePackages>(request);
            servicePackage.ServicePackageId = servicePackageId;
            servicePackage.ImageUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            servicePackage.Status = false;
            await _uow.ServicePackageRepo.AddAsync(servicePackage);

            ServicePackagePrices servicePackagePrice = new()
            {
                ServicePackagePriceId = Tools.GenerateIdFormat32(),
                ServicePackageId = servicePackageId,
                Date = Tools.GetDynamicTimeZone(),
                PriceByDate = request.Price
            };
            await _uow.ServicePackagePriceRepo.AddAsync(servicePackagePrice);

            return (201, $"{request.Name} service package is added");
        }
    }
}
