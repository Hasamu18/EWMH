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

            var leaderCount = request.WorkerList.Count(worker => worker.Item2 == true);
            if (leaderCount == 0)
                return (400, "Phải có ít nhất một nhân viên làm trưởng đại diện cho yêu cầu sửa chữa");
            else if (leaderCount > 1)
                return (400, "Chỉ được có duy nhất một trưởng đại diện cho yêu cầu sửa chữa");

            var getWorkersOfLeader = (await _uow.WorkerRepo.GetAsync(a => (a.LeaderId ?? "").Equals(request.LeaderId))).ToList();
            var existingWorkerIds = getWorkersOfLeader.Select(w => w.WorkerId).ToHashSet();

            var unexistedWorkers = request.WorkerList
                .Where(worker => !existingWorkerIds.Contains(worker.Item1))
                .ToList();

            if (unexistedWorkers.Count > 0)
            {
                var missingWorkerIds = unexistedWorkers.Select(w => w.Item1).ToList();
                return (404, $"Những nhân viên sau đây không tồn tại: {string.Join(", ", missingWorkerIds)}");
            }

            var getProccessingRequestList = (await _uow.RequestRepo.GetAsync(a => a.Status == 1)).ToList();
            var busyWorkers = new List<(string WorkerId, bool IsLead)>();
            for (var i = 0; getProccessingRequestList.Count > 0; i++)
            {
                var getWorkersInRequest = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(getProccessingRequestList[i].RequestId))).ToList();
                foreach (var worker in request.WorkerList)
                {
                    if (getWorkersInRequest.Any(w => w.WorkerId == worker.Item1))
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
                    WorkerId = worker.Item1,
                    IsLead = worker.Item2
                };
                await _uow.RequestWorkerRepo.AddAsync(requestWorker);
            }

            return (200, "Đã gán các nhân viên cho yêu cầu sửa chữa này");
        }
    }
}
