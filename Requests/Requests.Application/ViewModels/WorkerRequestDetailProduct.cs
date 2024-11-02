using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class WorkerRequestDetailProduct
    {
        public string RequestDetailId { get; set; } = null!;

        public string RequestId { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;

        public string ProductName { get; set; } = null!;

        public int ProductPrice { get; set; }

        public bool IsCustomerPaying { get; set; }
        public int Quantity { get; set; }

        public string ReplacementReason { get; set; } = null!;
    }
}
