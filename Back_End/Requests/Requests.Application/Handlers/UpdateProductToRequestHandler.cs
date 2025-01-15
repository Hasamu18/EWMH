using MediatR;
using Requests.Application.Commands;
using Requests.Application.ViewModels;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Handlers
{
    internal class UpdateProductToRequestHandler : IRequestHandler<UpdateProductToRequestCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public UpdateProductToRequestHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(UpdateProductToRequestCommand request, CancellationToken cancellationToken)
        {
            var getRequestDetail = await _uow.RequestDetailRepo.GetByIdAsync(request.Product.RequestDetailId);
            if (getRequestDetail == null)
                return (404, "Sản phẩm này không tồn tại trong đơn hàng đính kèm");

            var isHeadWorker = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(getRequestDetail.RequestId) &&
                                                                     a.WorkerId.Equals(request.HeadWorkerId))).ToList();
            if (isHeadWorker.Count == 0)
                return (404, "Nhân viên này không có trong yêu cầu này");

            if (!isHeadWorker[0].IsLead)
                return (409, "Chỉ có nhân viên đại diện cho yêu cầu này là có quyền sử dụng chức năng này");

            var getProduct = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(getRequestDetail.ProductId))).ToList();
            
            if (request.Product.Quantity > getProduct[0].InOfStock)
                return (409, $"Sản phẩm với tên: {getProduct[0].Name} chỉ còn {getProduct[0].InOfStock} cái");

            if (request.Product.Quantity == 0)
                return (409, "Không thể thêm số lượng bằng 0");

            getRequestDetail.Quantity = (int)request.Product.Quantity;
            getRequestDetail.IsCustomerPaying = request.Product.IsCustomerPaying;
            getRequestDetail.Description = request.Product.Description;
            await _uow.RequestDetailRepo.UpdateAsync(getRequestDetail);

            return (200, "Đã cập nhật vào yêu cầu này");
        }
    }
}
