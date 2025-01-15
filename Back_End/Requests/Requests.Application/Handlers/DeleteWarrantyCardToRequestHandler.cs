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
    internal class DeleteWarrantyCardToRequestHandler : IRequestHandler<DeleteWarrantyCardToRequestCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public DeleteWarrantyCardToRequestHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(DeleteWarrantyCardToRequestCommand request, CancellationToken cancellationToken)
        {
            var getWarrantyRequest = (await _uow.WarrantyRequestRepo.GetAsync(a => a.WarrantyCardId.Equals(request.WarrantyCardId)
                                      && a.RequestId.Equals(request.RequestId))).ToList();
            if (getWarrantyRequest.Count == 0)
                return (404, $"Sản phẩm với mã bảo hành: {request.WarrantyCardId} không tồn tại trong yêu cầu này");

            var isHeadWorker = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(request.RequestId) &&
                                                                     a.WorkerId.Equals(request.HeadWorkerId))).ToList();
            if (isHeadWorker.Count == 0)
                return (404, "Nhân viên này không có trong yêu cầu này");

            if (!isHeadWorker[0].IsLead)
                return (409, "Chỉ có nhân viên đại diện cho yêu cầu này là có quyền sử dụng chức năng này");

            await _uow.WarrantyRequestRepo.RemoveAsync(getWarrantyRequest[0]);

            return (200, "Đã xóa thẻ bảo hành khỏi yêu cầu này");
        }
    }
}
