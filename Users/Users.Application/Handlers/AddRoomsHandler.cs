using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Utility;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class AddRoomsHandler : IRequestHandler<AddRoomsCommand, string>
    {
        private readonly IUnitOfWork _uow;
        public AddRoomsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<string> Handle(AddRoomsCommand request, CancellationToken cancellationToken)
        {
            var existingApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.AreaId.Equals(request.AreaId))).ToList();
            if (existingApartment.Count == 0)
                return "Unexisted apartment";

            var duplicateRooms = request.Rooms
                .GroupBy(room => room)
                .Where(group => group.Count() > 1)
                .Select(group => group.Key)
                .ToList();

            if (duplicateRooms.Any())
                return $"The following rooms are duplicated: {string.Join(", ", duplicateRooms)}";

            foreach (var room in request.Rooms)
            {
                Rooms rooms = new()
                {
                    RoomId = Tools.GenerateIdFormat32(),
                    AreaId = existingApartment[0].AreaId,
                    RoomCode = room
                };
                await _uow.RoomRepo.AddAsync(rooms);
            }

            return $"{existingApartment[0].Name} apartment has added {request.Rooms.Count} rooms";
        }
    }
}
