using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Commands
{
    public class AddRoomsCommand : IRequest<string>
    {
        public required string AreaId { get; set; }

        [StringLength(10)]
        public required List<string> Rooms { get; set; }
    }
}
