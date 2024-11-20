using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class UpdateRoomHandler : IRequestHandler<UpdateRoomCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public UpdateRoomHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(UpdateRoomCommand request, CancellationToken cancellationToken)
        {
            var getRoom = (await _uow.RoomRepo.GetAsync(a => a.AreaId.Equals(request.AreaId) &&
                                                             a.RoomId.Equals(request.OldRoomId))).ToList();
            if (getRoom.Count == 0)
                return (404, $"Chung cư không tồn tại hoặc mã phòng: {request.OldRoomId} không tồn tại");

            var existingRoom = (await _uow.RoomRepo.GetAsync(a => a.AreaId.Equals(request.AreaId) &&
                                                             a.RoomId.Equals(request.NewRoomId))).ToList();
            if (existingRoom.Count != 0)
                return (409, "Mã phòng này đang tồn tại");

            await _uow.RoomRepo.RemoveAsync(getRoom[0]);
            Rooms room = new()
            {
                RoomId = request.NewRoomId,
                AreaId = getRoom[0].AreaId,
                CustomerId = null
            };
            await _uow.RoomRepo.AddAsync(room);

            return (200, "Đã cập nhật thành công");
        }
    }
}
