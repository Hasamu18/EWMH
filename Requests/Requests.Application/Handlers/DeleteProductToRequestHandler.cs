using MediatR;
using Requests.Application.Commands;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Handlers
{
    internal class DeleteProductToRequestHandler : IRequestHandler<DeleteProductToRequestCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public DeleteProductToRequestHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(DeleteProductToRequestCommand request, CancellationToken cancellationToken)
        {
            var getRequestDetail = await _uow.RequestDetailRepo.GetByIdAsync(request.RequestDetailId);
            if (getRequestDetail == null)
                return (404, "Sản phẩm này không tồn tại trong đơn hàng đính kèm");

            var isHeadWorker = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(getRequestDetail.RequestId) &&
                                                                     a.WorkerId.Equals(request.HeadWorkerId))).ToList();
            if (isHeadWorker.Count == 0)
                return (404, "Nhân viên này không có trong yêu cầu này");

            if (!isHeadWorker[0].IsLead)
                return (409, "Chỉ có nhân viên đại diện cho yêu cầu này là có quyền sử dụng chức năng này");

            await _uow.RequestDetailRepo.RemoveAsync(getRequestDetail);

            return (200, "Đã xóa thành công");
        }
    }
}
