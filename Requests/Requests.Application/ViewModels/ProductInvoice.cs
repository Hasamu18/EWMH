using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class ProductInvoice
    {
        public required string ProductName { get; set; }
        public int Quantity { get; set; }
        public int UnitPrice { get; set; }
        public int Amount { get; set; }
        public required string Description { get; set; }
    }
}
