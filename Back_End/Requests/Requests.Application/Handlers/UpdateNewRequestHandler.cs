using Logger.Utility;
using MediatR;
using Requests.Application.Commands;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Handlers
{
    internal class UpdateNewRequestHandler : IRequestHandler<UpdateNewRequestCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public UpdateNewRequestHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(UpdateNewRequestCommand request, CancellationToken cancellationToken)
        {
            var getRequest = await _uow.RequestRepo.GetByIdAsync(request.RequestId);
            if (getRequest == null)
                return (404, "Yêu cầu không tồn tại");

            if (getRequest.Status != (int)Request.Status.Requested)
                return (409, "Chỉ có thể cập nhập yêu cầu khi ở trạng thái \"yêu cầu mới\"");

            var getApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.LeaderId.Equals(getRequest.LeaderId))).ToList();

            var getRoom = (await _uow.RoomRepo.GetAsync(a => a.AreaId.Equals(getApartment[0].AreaId) &&
                                                             a.RoomId.Equals(request.RoomId))).ToList();
            if (getRoom.Count == 0)
                return (404, $"Mã phòng: {request.RoomId} không tồn tại ");

            var getCustomerRooms = (await _uow.RoomRepo.GetAsync(a => (a.CustomerId ?? "").Equals(getRequest.CustomerId))).ToList();
            for (int i = 1; i <= getCustomerRooms.Count; i++)
            {
                if (getCustomerRooms[i - 1].RoomId.Equals(request.RoomId))
                    break;
                else if (!getCustomerRooms[i - 1].RoomId.Equals(request.RoomId) && i == getCustomerRooms.Count)
                    return (409, $"Bạn không sở hữu căn hộ với mã phòng: {getRoom[0].RoomId}");
            }

            getRequest.RoomId = request.RoomId;
            getRequest.CustomerProblem = request.CustomerProblem;
            await _uow.RequestRepo.UpdateAsync(getRequest);

            return (200, "Yêu cầu đã được cập nhật!");
        }
    }
}
