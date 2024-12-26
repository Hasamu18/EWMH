using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Commands
{
    public class CreateNewRequestForCusCommand : IRequest<(int, string)>
    {
        public string CustomerId { get; set; }

        public string RoomId { get; set; }

        public string CustomerProblem { get; set; }

        public Request.CategoryRequest CategoryRequest { get; set; }

        public CreateNewRequestForCusCommand(string customerId, string roomId, string customerProblem, Request.CategoryRequest categoryRequest)
        {
            CustomerId = customerId;
            RoomId = roomId;
            CustomerProblem = customerProblem;
            CategoryRequest = categoryRequest;
        }
    }
}
