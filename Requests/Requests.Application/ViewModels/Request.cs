using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    internal class Request
    {
        public string RequestId { get; set; } = null!;
      
        public string RoomId { get; set; } = null!;

        public DateTime Start { get; set; }

        public DateTime? End { get; set; }
                
        public int Status { get; set; }

        public int CategoryRequest { get; set; }             
      
    }
}
