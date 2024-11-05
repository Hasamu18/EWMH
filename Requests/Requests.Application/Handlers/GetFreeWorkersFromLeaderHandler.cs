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
            var result = new List<object>();

            foreach (var item in processingList)
            {
                var getWorkers = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(item.RequestId))).ToList();

                foreach (var worker in getWorkers)
                {
                    // Fetch additional worker info from AccountRepo
                    var getWorkerInfo = await _uow.AccountRepo.GetByIdAsync(worker.WorkerId);

                    // Add combined info into result
                    result.Add(new
                    {
                        worker.RequestId,
                        worker.WorkerId,
                        WorkerInfo = getWorkerInfo
                    });
                }
            }

            if (!request.IsFree)
            {
                return result;
            }
            else
            {
                var getWorkers = (await _uow.WorkerRepo.GetAsync(a => (a.LeaderId ?? "").Equals(request.LeaderId))).ToList();

                // Extract WorkerIds from result for comparison
                var existingWorkerIds = result
                    .Select(w => (w as dynamic).WorkerId)
                    .ToHashSet();

                // Find free workers not in the existing result list
                var freeWorkers = new List<object>();
                foreach (var worker in getWorkers.Where(w => !existingWorkerIds.Contains(w.WorkerId)))
                {
                    // Fetch additional worker info from AccountRepo
                    var getWorkerInfo = await _uow.AccountRepo.GetByIdAsync(worker.WorkerId);

                    // Add worker info along with WorkerId and null RequestId (if applicable)
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
