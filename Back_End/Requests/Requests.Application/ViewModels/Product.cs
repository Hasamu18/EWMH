using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class Product
    {
        public required string ProductId { get; set; }
        public uint Quantity { get; set; }
        public bool IsCustomerPaying { get; set; }
        public required string Description { get; set; }
    }
}
