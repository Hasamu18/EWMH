using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class AddWorkersToRequest
    {
        public required string RequestId { get; set; }

        public required List<Worker> WorkerList { get; set; }
    }
}
