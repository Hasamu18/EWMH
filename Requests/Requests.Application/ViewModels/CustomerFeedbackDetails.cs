using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class CustomerFeedbackDetails:CustomerFeedback
    {        
        public string CustomerAddress{ get; set; } = null!;
        public string CustomerPhone { get; set; } = null!;

    }
}
