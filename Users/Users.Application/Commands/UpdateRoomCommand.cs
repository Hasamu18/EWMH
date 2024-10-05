using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Commands
{
    public class UpdateRoomCommand : IRequest<(int, string)>
    {
        public required string RoomId { get; set; }

        [StringLength(10)]
        public required string RoomCode { get; set; }
    }
}
