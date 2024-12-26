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
        public string ContractId { get; set; } = null!;
        public int Status { get; set; }
        public DateTime StartDate { get; set; }
        public string CustomerId { get; set; } = null!;
        public string CustomerAvatar { get; set; } = null!;
        public string CustomerName { get; set; } = null!;        
        public string CustomerEmail { get; set; } = null!;
        public string CustomerPhone { get; set; } = null!;
        public string CustomerProblem { get; set; } = null!;
        public WorkerRequestDetailApartment Apartment { get; set; } = null!;
        public string RoomId { get; set; } = null!;
        public List<WorkerRequestDetailWorker> Workers { get; set; } = null!;   
        public List<WorkerRequestDetailProduct> ReplacementProducts { get; set; } = null!;
        public List<WorkerRequestDetailWarrantyRequest> WarrantyRequests { get; set; } = null!;

    }
}
