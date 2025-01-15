using MediatR;
using Requests.Application.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class CreateNewCustomerFeedbackCommand : IRequest<(int, string)>
    {
        public CreateNewCustomerFeedbackRequest Request {get; set; }
        public string CustomerId { get; set; }  
        public CreateNewCustomerFeedbackCommand(CreateNewCustomerFeedbackRequest request, string customerId)
        {
            Request = request;
            CustomerId = customerId;
        }
    }
}
