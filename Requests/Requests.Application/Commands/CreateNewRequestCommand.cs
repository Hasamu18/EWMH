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

        public string CustomerId { get; set; }

        public string RoomId { get; set; }

        public string CustomerProblem { get; set; }

        public CreateNewRequestCommand(string leaderId, string customerId, string roomId, string customerProblem)
        {
            LeaderId = leaderId;
            CustomerId = customerId;
            RoomId = roomId;
            CustomerProblem = customerProblem;
        }
    }
}
