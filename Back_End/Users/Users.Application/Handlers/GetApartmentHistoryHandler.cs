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
    internal class GetApartmentHistoryHandler : IRequestHandler<GetApartmentHistoryQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetApartmentHistoryHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetApartmentHistoryQuery request, CancellationToken cancellationToken)
        {
            var result = new List<object>();
            var getApartmentHistory = (await _uow.LeaderHistoryRepo.GetAsync(a => a.AreaId.Equals(request.AreaId))).OrderByDescending(o => o.From).ToList();

            foreach (var getHistory in getApartmentHistory)
            {
                var getLeaderInfo = await _uow.AccountRepo.GetByIdAsync(getHistory.LeaderId);
                result.Add(new
                {
                    ApartmentHistory = new
                    {
                        getHistory.LeaderHistoryId,
                        getHistory.AreaId,
                        getHistory.LeaderId,
                        getHistory.From,
                        To = getHistory.To?.ToString("yyyy-MM-ddTHH:mm:ss.fff") ?? "Hiện tại"
                    },
                    Leader = new
                    {
                        getLeaderInfo?.Email,
                        getLeaderInfo?.PhoneNumber,
                        getLeaderInfo?.AvatarUrl,
                        getLeaderInfo?.FullName,
                        getLeaderInfo?.DateOfBirth
                    }
                });
            }
            return result;
        }
    }
}
