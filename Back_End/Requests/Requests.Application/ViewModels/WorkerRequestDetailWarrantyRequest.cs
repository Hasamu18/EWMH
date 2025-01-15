using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class WorkerRequestDetailWarrantyRequest
    {
        public string WarrantyCardId { get; set; } = null!;     
        public string ProductId { get; set; } = null!;
        public string ProductName { get; set; } = null!;
        public string ProductImageUrl { get; set; } = null!;
        public string ProductDescription { get; set; } = null!;

        public DateTime StartDate { get; set; }

        public DateTime ExpireDate { get; set; }
    }
}
