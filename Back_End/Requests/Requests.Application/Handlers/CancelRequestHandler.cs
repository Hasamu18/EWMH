using Logger.Utility;
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
    internal class CancelNewRequestHandler : IRequestHandler<CancelRequestCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public CancelNewRequestHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(CancelRequestCommand request, CancellationToken cancellationToken)
        {
            var getRequest = await _uow.RequestRepo.GetByIdAsync(request.RequestId);
            if (getRequest == null)
                return (404, "Yêu cầu không tồn tại");

            if (getRequest.Status != (int)Request.Status.Requested && getRequest.Status != (int)Request.Status.Processing)
                return (409, "Chỉ có thể hủy yêu cầu khi ở trạng thái \"yêu cầu mới\" hoặc \"đang xử lý\"");

            if (getRequest.CategoryRequest == (int)Request.CategoryRequest.Repair)
            {
                var getAttachedOrder = (await _uow.RequestDetailRepo.GetAsync(a => a.RequestId.Equals(request.RequestId))).ToList();
                foreach (var order in getAttachedOrder)
                    await _uow.RequestDetailRepo.RemoveAsync(order);
            }

            if (getRequest.Status == (int)Request.Status.Processing)
            {
                var getWorkers = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(request.RequestId))).ToList();
                foreach (var worker in getWorkers)
                    await _uow.RequestWorkerRepo.RemoveAsync(worker);
            }

            if (getRequest.ContractId != null)
            {
                var getContract = await _uow.ContractRepo.GetByIdAsync(getRequest.ContractId);
                getContract!.RemainingNumOfRequests += 1;
                await _uow.ContractRepo.UpdateAsync(getContract);
            }

            getRequest.End = Tools.GetDynamicTimeZone();
            getRequest.Conclusion = request.Conclusion;
            getRequest.Status = (int)Request.Status.Canceled;
            await _uow.RequestRepo.UpdateAsync(getRequest);

            return (200, "Yêu cầu đã được hủy!");
        }
    }
}
