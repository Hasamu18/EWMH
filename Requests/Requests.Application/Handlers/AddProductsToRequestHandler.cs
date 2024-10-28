using Logger.Utility;
using MediatR;
using Requests.Application.Commands;
using Requests.Domain.Entities;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Handlers
{
    internal class AddProductsToRequestHandler : IRequestHandler<AddProductsToRequestCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public AddProductsToRequestHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(AddProductsToRequestCommand request, CancellationToken cancellationToken)
        {
            var getRequest = await _uow.RequestRepo.GetByIdAsync(request.RequestId);
            if (getRequest == null)
                return (404, "Yêu cầu không tồn tại");

            var isHeadWorker = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(request.RequestId) &&
                                                                     a.WorkerId.Equals(request.HeadWorkerId))).ToList();
            if (isHeadWorker.Count == 0)
                return (404, "Nhân viên này không có trong yêu cầu sửa chữa này");

            if (!isHeadWorker[0].IsLead)
                return (409, "Chỉ có nhân viên đại diện cho yêu cầu này là có quyền sử dụng chức năng này");
        
            foreach (var product in request.ProductList)
            {
                var getProduct = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(product.Item1))).ToList();
                if (getProduct.Count == 0)
                    return (404, $"Sản phẩm với Id: {product.Item1} không tồn tại");

                if (product.Item2 > getProduct[0].InOfStock)
                    return (409, $"Sản phẩm với tên: {getProduct[0].Name} chỉ còn {getProduct[0].InOfStock} cái");

                if (product.Item2 == 0)
                    return (409, "Không thể thêm số lượng bằng 0");
            }
            foreach (var product in request.ProductList)
            {
                var getProduct = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(product.Item1))).ToList();
                getProduct[0].InOfStock -= (int)product.Item2;
                await _uow.ProductRepo.UpdateAsync(getProduct[0]);

                RequestDetails requestDetail = new()
                {
                    RequestDetailId = $"RD_{Tools.GenerateRandomString(20)}",
                    RequestId = request.RequestId,
                    ProductId = product.Item1,
                    Quantity = (int)product.Item2,
                    IsCustomerPaying = product.Item3,
                    Description = product.Item4
                };
                await _uow.RequestDetailRepo.AddAsync(requestDetail);
            }
                
            return (200, "Đã thêm các sản phẩm có nhu cầu vào yêu cầu sửa chữa này");
        }
    }
}
