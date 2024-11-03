using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class WorkerRequestDetailWorker
    {
        public string WorkerId { get; set; }
        public string WorkerName { get; set; }
        public string WorkerAvatar {  get; set; }   
        public string WorkerPhoneNumber { get; set; }
        public bool IsLead { get; set; }
    }
}
