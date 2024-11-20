using MediatR;
using Sales.Application.Commands;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    public class DisableProductHandler : IRequestHandler<DisableProductCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public DisableProductHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(DisableProductCommand request, CancellationToken cancellationToken)
        {
            var existingProduct = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(request.ProductId))).ToList();
            if (existingProduct.Count == 0)
                return (404, "Sản phẩm không tồn tại");

            existingProduct[0].Status = request.Status;
            await _uow.ProductRepo.UpdateAsync(existingProduct[0]);

            if (request.Status)
                return (200, $"Sản phẩm: {existingProduct[0].Name} đã bị vô hiệu hóa");
            return (200, $"Sản phẩm: {existingProduct[0].Name} đã được kích hoạt");
        }
    }
}
