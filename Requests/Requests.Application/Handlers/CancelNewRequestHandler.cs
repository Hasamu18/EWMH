using MediatR;
using Requests.Application.Commands;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Handlers
{
    internal class CancelNewRequestHandler : IRequestHandler<CancelNewRequestCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public CancelNewRequestHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(CancelNewRequestCommand request, CancellationToken cancellationToken)
        {
            var getRequest = await _uow.RequestRepo.GetByIdAsync(request.RequestId);
            if (getRequest == null)
                return (404, "Yêu cầu không tồn tại");

            if (getRequest.Status != (int)Request.Status.Requested)
                return (409, "Chỉ có thể hủy yêu cầu sửa chữa khi ở trạng thái \"yêu cầu mới\"");

            await _uow.RequestRepo.RemoveAsync(getRequest);

            return (200, "Yêu cầu sửa chữa đã được hủy!");
        }
    }
}
