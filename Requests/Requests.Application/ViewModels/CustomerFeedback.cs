using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class CustomerFeedback
    {
        public string FeedbackId { get; set; } = null!;
        public string RequestId { get; set; } = null!;
        public string CustomerName { get; set; } = null!;        
        public string CustomerEmail { get; set; } = null!;
        public string AvatarUrl { get; set; } = null!;
        public string Content { get; set; } = null!;
        public int Rate { get; set; }
        public bool Status { get; set; }

    }
}
