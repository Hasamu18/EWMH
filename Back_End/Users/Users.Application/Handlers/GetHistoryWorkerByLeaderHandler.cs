using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Queries;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    internal class GetHistoryWorkerByLeaderHandler : IRequestHandler<GetHistoryWorkerByLeaderQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetHistoryWorkerByLeaderHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetHistoryWorkerByLeaderQuery request, CancellationToken cancellationToken)
        {
            var result = new List<object>();

            var items = (await _uow.WorkerHistoryRepo
                .GetAsync(a => a.LeaderId.Equals(request.LeaderId)))
                .ToList();

            var group = items.GroupBy(g => g.WorkerId);

            foreach (var item in group)
            {
                var getWorker = await _uow.AccountRepo.GetByIdAsync(item.Key);

                var workerResult = new
                {
                    getWorker!.AccountId,
                    getWorker.FullName,
                    getWorker.Email,
                    getWorker.PhoneNumber,
                    getWorker.AvatarUrl,
                    getWorker.DateOfBirth,
                    History = item
                        .OrderByDescending(h => h.To == null) 
                        .ThenByDescending(h => h.From)
                        .Select(history => new
                        {
                            history.From,
                            To = history?.To?.ToString("yyyy-MM-ddTHH:mm:ss.fff") ?? "Hiện tại"
                        }).ToList()
                };

                result.Add(workerResult);
            }
            return result;
        }
    }
}
