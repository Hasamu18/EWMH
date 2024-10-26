using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Commands
{
    public class AddRoomsCommand : IRequest<(int, string)>
    {
        public required string AreaId { get; set; }

        public required List<string> RoomIds { get; set; }
    }
}
