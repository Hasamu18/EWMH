using MediatR;
using Requests.Application.Queries;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Handlers
{
    internal class GetFreeWorkersFromLeaderHandler : IRequestHandler<GetFreeWorkersFromLeaderQuery, List<object>>
    {
        private readonly IUnitOfWork _uow;
        public GetFreeWorkersFromLeaderHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<List<object>> Handle(GetFreeWorkersFromLeaderQuery request, CancellationToken cancellationToken)
        {
            var processingList = (await _uow.RequestRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId) &&
                                                   a.Status == (int)Request.Status.Processing)).ToList();

            var deliveringAndAssignedList = (await _uow.ShippingRepo.GetAsync(a => 
                                            (a.LeaderId.Equals(request.LeaderId) && a.Status == 1) ||
                                            (a.LeaderId.Equals(request.LeaderId) && a.Status == 2))).ToList();
            var result = new List<object>();

            foreach (var item in processingList)
            {
                var getWorkers = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(item.RequestId))).ToList();

                foreach (var worker in getWorkers)
                {
                    var getWorkerInfo = await _uow.AccountRepo.GetByIdAsync(worker.WorkerId);

                    result.Add(new
                    {
                        worker.RequestId,
                        worker.WorkerId,
                        WorkerInfo = getWorkerInfo
                    });
                }
            }
            foreach (var item in deliveringAndAssignedList)
            {
                var getWorkerInfo = await _uow.AccountRepo.GetByIdAsync(item.WorkerId!);

                result.Add(new
                {
                    item.ShippingId,
                    item.WorkerId,
                    WorkerInfo = getWorkerInfo
                });
            }

            if (!request.IsFree)
            {
                return result;
            }
            else
            {
                var getWorkers = (await _uow.WorkerRepo.GetAsync(a => (a.LeaderId ?? "").Equals(request.LeaderId))).ToList();

                var existingWorkerIds = result
                    .Select(w => (w as dynamic).WorkerId)
                    .ToHashSet();

                var freeWorkers = new List<object>();
                foreach (var worker in getWorkers.Where(w => !existingWorkerIds.Contains(w.WorkerId)))
                {
                    var getWorkerInfo = await _uow.AccountRepo.GetByIdAsync(worker.WorkerId);

                    freeWorkers.Add(new
                    {
                        worker.WorkerId,
                        WorkerInfo = getWorkerInfo
                    });
                }

                return freeWorkers;
            }
        }
    }
}
