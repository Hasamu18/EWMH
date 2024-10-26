using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class CreateNewRequestCommand : IRequest<(int, string)>
    {
        public string LeaderId { get; set; }

        public string Email_Or_Phone { get; set; }

        public string RoomId { get; set; }

        public string CustomerProblem { get; set; }

        public CreateNewRequestCommand(string leaderId, string emailOrPhone, string roomId, string customerProblem)
        {
            LeaderId = leaderId;
            Email_Or_Phone = emailOrPhone;
            RoomId = roomId;
            CustomerProblem = customerProblem;
        }
    }
}
