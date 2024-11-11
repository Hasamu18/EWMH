using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class CreateNewCustomerFeedbackRequest
    {
        public string RequestId { get; set; } = null!;
        public string Content{ get; set; } = null!;
        public int Rate{ get; set; }


    }
}
