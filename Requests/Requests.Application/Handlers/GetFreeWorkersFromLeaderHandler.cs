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
                var getWorkerInfo = await _uow.AccountRepo.GetByIdAsync(getWorkers[0].WorkerId);
                result.AddRange(getWorkers.Select(w => new { w.RequestId, w.WorkerId }));
            }
            if (!request.IsFree)
                return result;
            else
            {
                var getWorkers = (await _uow.WorkerRepo.GetAsync(a => (a.LeaderId ?? "").Equals(request.LeaderId))).ToList();
                var existingWorkerIds = result
                    .Select(w => (w as dynamic).WorkerId) 
                    .ToHashSet();

                var freeWorkers = getWorkers
                    .Where(w => !existingWorkerIds.Contains(w.WorkerId))
                    .Cast<object>()
                    .ToList();

                return freeWorkers;
            }
        }
    }
}
