using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Commands
{
    public class CreateCustomerCommand : IRequest<(int, string)>
    {
        public required string PendingAccountId { get; set; }       

        public required List<string> RoomIds { get; set; }

        public bool IsApproval { get; set; }

        public string? Reason { get; set; }
    }
}
