using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetCustomerRoomsQuery : IRequest<(int, object)>
    {
        public string LeaderId { get; set; }
        public string Email_Or_Phone { get; set; }

        public GetCustomerRoomsQuery(string leaderId, string email_Or_Phone)
        {
            LeaderId = leaderId;
            Email_Or_Phone = email_Or_Phone;
        }
    }
}
