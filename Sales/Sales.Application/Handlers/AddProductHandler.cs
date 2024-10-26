using Logger.Utility;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
    public class AddProductHandler : IRequestHandler<AddProductCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public AddProductHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(AddProductCommand request, CancellationToken cancellationToken)
        {
            var extensionFile = Path.GetExtension(request.Image.FileName);
            string[] extensionSupport = [".png", ".jpg"];
            if (!extensionSupport.Contains(extensionFile.ToLower()))
                return (400, "The avatar should be .png or .jpg");

            var productId = $"P_{(await _uow.ProductRepo.Query().CountAsync() + 1):D10}";
            var bucketAndPath = await _uow.ProductRepo.UploadFileToStorageAsync(productId, request.Image, _config);
            var product = SaleMapper.Mapper.Map<Products>(request);
            product.ProductId = productId;
            product.ImageUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            product.Status = false;
            await _uow.ProductRepo.AddAsync(product);

            ProductPrices productPrice = new()
            {
                ProductPriceId = $"PP_{Tools.GenerateRandomString(20)}",
                ProductId = productId,
                Date = Tools.GetDynamicTimeZone(),
                PriceByDate = request.Price
            };
            await _uow.ProductPriceRepo.AddAsync(productPrice);

            return (201, $"{request.Name} product is added");
        }
    }
}
