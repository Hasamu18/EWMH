using Logger.Utility;
using MediatR;
using Microsoft.Extensions.Configuration;
using Sales.Application.Commands;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    public class UpdateServicePackageHandler : IRequestHandler<UpdateServicePackageCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public UpdateServicePackageHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(UpdateServicePackageCommand request, CancellationToken cancellationToken)
        {
            var existingServicePackage = (await _uow.ServicePackageRepo.GetAsync(a => a.ServicePackageId.Equals(request.ServicePackageId))).ToList();
            if (existingServicePackage.Count == 0)
                return (404, "Service package does not exist");

            var extensionFile = Path.GetExtension(request.Image.FileName);
            string[] extensionSupport = [".png", ".jpg"];
            if (!extensionSupport.Contains(extensionFile.ToLower()))
                return (400, "The avatar should be .png or .jpg");

            var bucketAndPath = await _uow.ServicePackageRepo.UploadFileToStorageAsync(request.ServicePackageId, request.Image, _config);
            existingServicePackage[0].Name = request.Name;
            existingServicePackage[0].Description = request.Description;
            existingServicePackage[0].ImageUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            existingServicePackage[0].NumOfRequest = request.NumOfRequest;
            await _uow.ServicePackageRepo.UpdateAsync(existingServicePackage[0]);

            ServicePackagePrices servicePackagePrice = new()
            {
                ServicePackagePriceId = $"SPP_{Tools.GenerateRandomString(20)}",
                ServicePackageId = existingServicePackage[0].ServicePackageId,
                Date = Tools.GetDynamicTimeZone(),
                PriceByDate = request.Price
            };
            await _uow.ServicePackagePriceRepo.AddAsync(servicePackagePrice);

            return (200, $"{request.Name} service package is updated");
        }
    }
}
