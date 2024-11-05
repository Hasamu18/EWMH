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
    public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public UpdateProductHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var existingProduct = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(request.ProductId))).ToList();
            if (existingProduct.Count == 0)
                return (404, "Product does not exist");

            if (request.Image != null)
            {
                var extensionFile = Path.GetExtension(request.Image.FileName);
                string[] extensionSupport = [".png", ".jpg"];
                if (!extensionSupport.Contains(extensionFile.ToLower()))
                    return (400, "The avatar should be .png or .jpg");

                var bucketAndPath = await _uow.ProductRepo.UploadFileToStorageAsync(request.ProductId, request.Image, _config);
                existingProduct[0].ImageUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            }

            existingProduct[0].Name = request.Name;
            existingProduct[0].Description = request.Description;
            existingProduct[0].InOfStock = request.InOfStock;
            existingProduct[0].WarantyMonths = request.WarantyMonths;
            await _uow.ProductRepo.UpdateAsync(existingProduct[0]);            

            ProductPrices productPrice = new()
            {
                ProductPriceId = $"PP_{Tools.GenerateRandomString(20)}",
                ProductId = existingProduct[0].ProductId,
                Date = Tools.GetDynamicTimeZone(),
                PriceByDate = request.Price
            };
            await _uow.ProductPriceRepo.AddAsync(productPrice);

            return (200, $"{request.Name} product is updated");
        }
    }
}
