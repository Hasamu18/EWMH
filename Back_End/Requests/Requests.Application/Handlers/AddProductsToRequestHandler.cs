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
using static Logger.Utility.Constants;

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

            if (getRequest.CategoryRequest == (int)Request.CategoryRequest.Warranty)
                return (409, "Chỉ có thể thêm sản phẩm đính kèm khi yêu cầu này là \"yêu cầu sửa chữa (Repair Request)\"");

            var isHeadWorker = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(request.RequestId) &&
                                                                     a.WorkerId.Equals(request.HeadWorkerId))).ToList();
            if (isHeadWorker.Count == 0)
                return (404, "Nhân viên này không có trong yêu cầu này");

            if (!isHeadWorker[0].IsLead)
                return (409, "Chỉ có nhân viên đại diện cho yêu cầu này là có quyền sử dụng chức năng này");

            if (getRequest.Status != (int)Request.Status.Processing)
                return (409, "Chỉ có yêu cầu khi ở trạng thái \"đang xử lý\" mới có thể sử dụng chức năng này");

            foreach (var product in request.ProductList)
            {
                var getProduct = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(product.ProductId))).ToList();
                if (getProduct.Count == 0)
                    return (404, $"Sản phẩm với Id: {product.ProductId} không tồn tại");

                if (product.Quantity > getProduct[0].InOfStock)
                    return (409, $"Sản phẩm với tên: {getProduct[0].Name} chỉ còn {getProduct[0].InOfStock} cái");

                if (product.Quantity == 0)
                    return (409, "Không thể thêm số lượng bằng 0");
            }
            foreach (var product in request.ProductList)
            {
                RequestDetails requestDetail = new()
                {
                    RequestDetailId = $"RD_{Tools.GenerateRandomString(20)}",
                    RequestId = request.RequestId,
                    ProductId = product.ProductId,
                    Quantity = (int)product.Quantity,
                    IsCustomerPaying = product.IsCustomerPaying,
                    Description = product.Description
                };
                await _uow.RequestDetailRepo.AddAsync(requestDetail);
            }
                
            return (200, "Đã thêm các sản phẩm có nhu cầu vào yêu cầu này");
        }
    }
}
