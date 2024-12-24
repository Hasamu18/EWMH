using Logger.Utility;
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
    internal class GetWorkerHistoryHandler : IRequestHandler<GetWorkerHistoryQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetWorkerHistoryHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetWorkerHistoryQuery request, CancellationToken cancellationToken)
        {
            var result = new List<object>();
            var getWorkerHistory = (await _uow.WorkerHistoryRepo.GetAsync(a => a.WorkerId.Equals(request.WorkerId))).OrderByDescending(o => o.From).ToList();
            var current = Tools.GetDynamicTimeZone();
            foreach (var getHistory in getWorkerHistory)
            {
                var getDraftRequestList = (await _uow.RequestRepo.GetAsync(a => a.LeaderId == getHistory.LeaderId &&
                                                                      a.Start >= getHistory.From && a.Start <= (getHistory.To ?? current), 
                                                                      includeProperties: "RequestWorkers"))
                                                                      .OrderByDescending(o => o.Start)
                                                                      .ToList();
                var getRequestList = getDraftRequestList
                    .SelectMany(s => s.RequestWorkers
                    .Where(s => s.WorkerId == request.WorkerId)
                    .Select(worker => new
                    {
                        worker.RequestId,
                        worker.Request.Start
                    }))
                    .ToList();

                var getShippingList = (await _uow.ShippingRepo.GetAsync(a => a.LeaderId == getHistory.LeaderId &&
                                                                      a.WorkerId == request.WorkerId &&
                                                                      a.ShipmentDate >= getHistory.From && a.ShipmentDate <= (getHistory.To ?? current)))
                                                                      .OrderByDescending(o => o.ShipmentDate)
                                                                      .Select(s => new
                                                                      {
                                                                          s.ShippingId,
                                                                          s.ShipmentDate
                                                                      })
                                                                      .ToList();

                var getLeaderInfo = await _uow.AccountRepo.GetByIdAsync(getHistory.LeaderId);
                result.Add(new
                {
                    WorkerHistory = new
                    {
                        getHistory.WorkerHistoryId,
                        LeaderInfo = getLeaderInfo,
                        getHistory.WorkerId,
                        getHistory.From,
                        To = getHistory.To?.ToString("yyyy-MM-ddTHH:mm:ss.fff") ?? "Hiện tại"
                    },
                    RequestList = getRequestList,
                    ShippingList = getShippingList
                });
            }
            return result;
        }
    }
}
