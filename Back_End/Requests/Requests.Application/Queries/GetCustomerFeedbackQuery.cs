using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Queries
{
    public class GetCustomerFeedbackQuery : IRequest<(int,object)>
    {        
        public string FeedbackId{ get; set; }        
        public GetCustomerFeedbackQuery(string feedbackId)
        {
            FeedbackId = feedbackId;
            
        }
    }
}
