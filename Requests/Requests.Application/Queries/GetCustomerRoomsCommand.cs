using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetCustomerRoomsCommand : IRequest<object>
    {
        public required string Email_Or_Phone { get; set; }
    }
}
