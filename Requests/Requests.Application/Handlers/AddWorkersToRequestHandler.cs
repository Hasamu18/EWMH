using MediatR;
using Requests.Application.Commands;
using Requests.Application.ViewModels;
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
    internal class AddWorkersToRequestHandler : IRequestHandler<AddWorkersToRequestCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public AddWorkersToRequestHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(AddWorkersToRequestCommand request, CancellationToken cancellationToken)
        {
            var getRequest = await _uow.RequestRepo.GetByIdAsync(request.RequestId);
            if (getRequest == null)
                return (404, "Yêu cầu không tồn tại");

            bool allUnique = request.WorkerList
    .Select(worker => worker.WorkerId)
    .Distinct()
    .Count() == request.WorkerList.Count;
            if (!allUnique)
                return (409, "Không được có các nhân viên trùng nhau");

            if (getRequest.Status != (int)Request.Status.Requested)
                return (409, "Chỉ có thể thêm các nhân viên vào một \"yêu cầu mới\"");

            var leaderCount = request.WorkerList.Count(worker => worker.IsLead == true);
            if (leaderCount == 0)
                return (409, "Phải có ít nhất một nhân viên làm trưởng đại diện cho yêu cầu sửa chữa");
            else if (leaderCount > 1)
                return (409, "Chỉ được có duy nhất một trưởng đại diện cho yêu cầu sửa chữa");

            var getWorkersOfLeader = (await _uow.WorkerRepo.GetAsync(a => (a.LeaderId ?? "").Equals(request.LeaderId))).ToList();
            var existingWorkerIds = getWorkersOfLeader.Select(w => w.WorkerId).ToHashSet();

            var unexistedWorkers = request.WorkerList
                .Where(worker => !existingWorkerIds.Contains(worker.WorkerId))
                .ToList();

            if (unexistedWorkers.Count > 0)
            {
                var missingWorkerIds = unexistedWorkers.Select(w => w.WorkerId).ToList();
                return (404, $"Những nhân viên sau đây không tồn tại: {string.Join(", ", missingWorkerIds)}");
            }

            var getProccessingRequestList = (await _uow.RequestRepo.GetAsync(a => a.Status == 1)).ToList();
            var busyWorkers = new List<Worker>();
            for (var i = 0; i < getProccessingRequestList.Count; i++)
            {
                var getWorkersInRequest = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(getProccessingRequestList[i].RequestId))).ToList();
                foreach (var worker in request.WorkerList)
                {
                    if (getWorkersInRequest.Any(w => w.WorkerId == worker.WorkerId))
                        busyWorkers.Add(worker);
                }
            }

            if (busyWorkers.Count > 0)
            {
                var busyWorkerIds = string.Join(", ", busyWorkers.Select(w => w.WorkerId));
                return (409, $"Những nhân viên sau đang bận trong các yêu cầu sửa chữa khác: {busyWorkerIds}");
            }

            getRequest.Status = (int)Request.Status.Processing;
            await _uow.RequestRepo.UpdateAsync(getRequest);

            foreach (var worker in request.WorkerList)
            {
                RequestWorkers requestWorker = new()
                {
                    RequestId = request.RequestId,
                    WorkerId = worker.WorkerId,
                    IsLead = worker.IsLead
                };
                await _uow.RequestWorkerRepo.AddAsync(requestWorker);
            }

            return (200, "Đã gán các nhân viên cho yêu cầu sửa chữa này");
        }
    }
}
