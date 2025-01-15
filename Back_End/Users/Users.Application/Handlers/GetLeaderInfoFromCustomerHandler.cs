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
    internal class GetLeaderInfoFromCustomerHandler : IRequestHandler<GetLeaderInfoFromCustomerQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetLeaderInfoFromCustomerHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetLeaderInfoFromCustomerQuery request, CancellationToken cancellationToken)
        {
            var existingUser = await _uow.CustomerRepo.GetByIdAsync(request.CustomerId);
            var getAreaId = (await _uow.RoomRepo.GetAsync(a => (a.CustomerId ?? "").Equals(existingUser!.CustomerId))).FirstOrDefault();
            if (getAreaId == null)
                return "Bạn không sở hữu căn hộ nào cả có thể do căn hộ trước đó là bạn thuê có thời hạn hay đã trả phòng, hiện tại bạn đã không còn sở hữu căn phòng đó";
        
            var getApartment = await _uow.ApartmentAreaRepo.GetByIdAsync(getAreaId.AreaId);
            var leaderInfo = await _uow.AccountRepo.GetByIdAsync(getApartment!.LeaderId);
            return new
            {
                Apartment = getApartment,
                LeaderInfo = leaderInfo
            };
        }
    }
}
