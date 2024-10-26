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
                return (404, $"Unexisted apartment or Unexisted {request.OldRoomId} room ");

            var existingRoom = (await _uow.RoomRepo.GetAsync(a => a.AreaId.Equals(request.AreaId) &&
                                                             a.RoomId.Equals(request.NewRoomId))).ToList();
            if (existingRoom.Count != 0)
                return (409, "This room code is existing");

            await _uow.RoomRepo.RemoveAsync(getRoom[0]);
            Rooms room = new()
            {
                RoomId = request.NewRoomId,
                AreaId = getRoom[0].AreaId,
                CustomerId = null
            };
            await _uow.RoomRepo.AddAsync(room);

            return (200, "Updated successfully");
        }
    }
}
