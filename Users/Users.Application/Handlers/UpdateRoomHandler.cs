using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class UpdateRoomHandler : IRequestHandler<UpdateRoomCommand, string>
    {
        private readonly IUnitOfWork _uow;
        public UpdateRoomHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<string> Handle(UpdateRoomCommand request, CancellationToken cancellationToken)
        {
            var existingRoom = (await _uow.RoomRepo.GetAsync(a => a.RoomId.Equals(request.RoomId))).ToList();
            if (existingRoom.Count == 0)
                return "Unexisted room";

            var getRoom = (await _uow.RoomRepo.GetAsync(a => a.AreaId.Equals(existingRoom[0].AreaId) &&
                                                             a.RoomCode.Equals(request.RoomCode))).ToList();
            if (getRoom.Count != 0)
                return "This room code is existing";

            existingRoom[0].RoomCode = request.RoomCode;
            await _uow.RoomRepo.UpdateAsync(existingRoom[0]);

            return "Updated successfully";
        }
    }
}
