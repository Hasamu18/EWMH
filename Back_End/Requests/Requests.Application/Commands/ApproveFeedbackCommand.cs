using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class ApproveFeedbackCommand : IRequest<(int, string)>
    {
        public string FeedbackId { get; set; }        
        public ApproveFeedbackCommand(string feedbackId)
        {
            FeedbackId = feedbackId;
        }
    }
}
