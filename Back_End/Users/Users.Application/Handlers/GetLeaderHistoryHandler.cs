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
    internal class GetLeaderHistoryHandler : IRequestHandler<GetLeaderHistoryQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetLeaderHistoryHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetLeaderHistoryQuery request, CancellationToken cancellationToken)
        {
            var result = new List<object>();
            var getLeaderHistory = (await _uow.LeaderHistoryRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId))).OrderByDescending(o => o.From).ToList();
            var current = Tools.GetDynamicTimeZone();
            foreach (var getHistory in getLeaderHistory)
            {
                var getCusIdList = (await _uow.RoomRepo.GetAsync(a => a.AreaId.Equals(getHistory.AreaId)))
                                                                            .Where(a => a.CustomerId != null)
                                                                            .Select(a => a.CustomerId)
                                                                            .Distinct()
                                                                            .ToList();
                var getRequestList = (await _uow.RequestRepo.GetAsync(a => getCusIdList.Contains(a.CustomerId) &&
                                                                      a.Start >= getHistory.From && a.Start <= (getHistory.To ?? current)))
                                                                      .OrderByDescending(o => o.Start)
                                                                      .Select(s => new
                                                                      {
                                                                          s.RequestId,
                                                                          s.Start
                                                                      })
                                                                      .ToList();
               
                var getContractList = (await _uow.ContractRepo.GetAsync(a => getCusIdList.Contains(a.CustomerId) &&
                                                                      a.PurchaseTime >= getHistory.From && a.PurchaseTime <= (getHistory.To ?? current) &&
                                                                      a.OrderCode != 2))
                                                                      .OrderByDescending(o => o.PurchaseTime)
                                                                      .Select(s => new
                                                                      {
                                                                          s.ContractId,
                                                                          s.PurchaseTime
                                                                      })
                                                                      .ToList();
               
                var getOrderList = (await _uow.OrderRepo.GetAsync(a => getCusIdList.Contains(a.CustomerId) &&
                                                                      a.PurchaseTime >= getHistory.From && a.PurchaseTime <= (getHistory.To ?? current) &&
                                                                      a.OrderCode != null))
                                                                      .OrderByDescending(o => o.PurchaseTime)
                                                                      .Select(s => new
                                                                      {
                                                                          s.OrderId,
                                                                          s.PurchaseTime
                                                                      })
                                                                      .ToList();

                var getApartment = await _uow.ApartmentAreaRepo.GetByIdAsync(getHistory.AreaId);
                
                result.Add(new
                {
                    LeaderHistory = new
                    {
                        getHistory.LeaderHistoryId,
                        Apartment = new
                        {
                            getHistory.AreaId,
                            getApartment
                        },
                        getHistory.LeaderId,
                        getHistory.From,
                        To = getHistory.To?.ToString("yyyy-MM-ddTHH:mm:ss.fff") ?? "Hiện tại"
                    },
                    RequestList = getRequestList,
                    ContractList = getContractList,
                    OrderList = getOrderList
                });
            }
            return result;
        }
    }
}
