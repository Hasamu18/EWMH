using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class WorkerRequestDetail
    {
        public string RequestId { get; set; } = null!;        
        public int Status { get; set; }
        public string CustomerAvatar { get; set; } = null!;
        public string CustomerName { get; set; } = null!;        
        public string CustomerEmail { get; set; } = null!;
        public string CustomerPhone { get; set; } = null!;
        public string CustomerProblem { get; set; } = null!;
        public string RoomId { get; set; } = null!;
        public List<WorkerRequestDetailWorker> Workers { get; set; } = null!;   
        public List<WorkerRequestDetailProduct> ReplacementProducts { get; set; } = null!;   
     
    }
}
