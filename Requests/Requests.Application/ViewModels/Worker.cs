using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class Worker
    {
        public required string WorkerId { get; set; }

        public bool IsLead { get; set; }
    }
}
