using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class UpdateProductToRequest
    {
        public required RequestDetail Product { get; set; }
    }
}
