using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Logger.Utility;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class AddRoomsHandler : IRequestHandler<AddRoomsCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public AddRoomsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(AddRoomsCommand request, CancellationToken cancellationToken)
        {
            var existingApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.AreaId.Equals(request.AreaId),
                                                                           includeProperties: "Rooms")).ToList();
            if (existingApartment.Count == 0)
                return (404, "Chung cư không tồn tại");

            foreach (var room in request.RoomIds)
            {
                if (room.Length > 10)
                    return (404, $"Mã phòng: {room} không hợp lệ, room Id phải ít hơn hoặc bằng 10 ký tự");
            }

            var roomsInApartmentCurrent = existingApartment[0].Rooms.Select(r => r.RoomId).ToList();
            var allRoomCurrent = roomsInApartmentCurrent.Concat(request.RoomIds).ToList();
            var duplicateRooms = allRoomCurrent
                .GroupBy(room => room)
                .Where(group => group.Count() > 1)
                .Select(group => group.Key)
                .ToList();

            if (duplicateRooms.Count != 0)
                return (409, $"Những phòng sau đang bị trùng lặp: {string.Join(", ", duplicateRooms)}");

            foreach (var room in request.RoomIds)
            {
                Rooms rooms = new()
                {
                    RoomId = room,
                    AreaId = existingApartment[0].AreaId,
                    CustomerId = null
                };
                await _uow.RoomRepo.AddAsync(rooms);
            }

            return (201, $"Chung cư: {existingApartment[0].Name} đã thêm {request.RoomIds.Count} phòng");
        }
    }
}
