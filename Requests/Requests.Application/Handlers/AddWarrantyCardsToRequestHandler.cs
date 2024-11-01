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
    internal class AddWarrantyCardsToRequestHandler : IRequestHandler<AddWarrantyCardsToRequestCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public AddWarrantyCardsToRequestHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(AddWarrantyCardsToRequestCommand request, CancellationToken cancellationToken)
        {
            var getRequest = await _uow.RequestRepo.GetByIdAsync(request.RequestId);
            if (getRequest == null)
                return (404, "Yêu cầu không tồn tại");

            var isHeadWorker = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(request.RequestId) &&
                                                                     a.WorkerId.Equals(request.HeadWorkerId))).ToList();
            if (isHeadWorker.Count == 0)
                return (404, "Nhân viên này không có trong yêu cầu này");

            if (!isHeadWorker[0].IsLead)
                return (409, "Chỉ có nhân viên đại diện cho yêu cầu này là có quyền sử dụng chức năng này");

            if (getRequest.CategoryRequest != (int)Request.CategoryRequest.Warranty)
                return (409, "Chỉ có yêu cầu là dạng bảo hành mới có thể sử dụng chức năng này");

            if (getRequest.Status != (int)Request.Status.Processing)
                return (409, "Chỉ có yêu cầu khi ở trạng thái \"đang xử lý\" mới có thể sử dụng chức năng này");
            
            foreach (var warrantyCardId in request.WarrantyCardIdList)
            {
                var getWarrantyCard = await _uow.WarrantyCardRepo.GetByIdAsync(warrantyCardId);
                if (getWarrantyCard == null)
                    return (404, $"Thẻ bảo hành với Id: {warrantyCardId} không tồn tại");

                if (!getWarrantyCard.CustomerId.Equals(getRequest.CustomerId))
                    return (409, $"Thẻ bảo hành cho sản phẩm này không phải của khách hàng được gán trong yêu cầu này");

                if (getWarrantyCard.ExpireDate < Tools.GetDynamicTimeZone())
                    return (409, $"Sản phẩm với mã bảo hành: {warrantyCardId} đã hết hạn, không thể bảo hành");

                var getWarrantyRequest = (await _uow.WarrantyRequestRepo.GetAsync(a => a.WarrantyCardId.Equals(warrantyCardId)
                                      && a.RequestId.Equals(request.RequestId))).ToList();
                if (getWarrantyRequest.Count != 0)
                    return (409, $"Sản phẩm với mã bảo hành: {warrantyCardId} đã được thêm vào từ trước, không thể thêm lại");
            }

            foreach (var warrantyCardId in request.WarrantyCardIdList)
            {
                WarrantyRequests warrantyRequest = new()
                {
                    WarrantyCardId = warrantyCardId,
                    RequestId = request.RequestId
                };
                await _uow.WarrantyRequestRepo.AddAsync(warrantyRequest); 
            }

            return (201, "Đã thêm các thẻ bảo hành vào yêu cầu này");
        }
    }
}
