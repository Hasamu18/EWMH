using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class AddWarrantyCardsToRequest
    {
        public required string RequestId { get; set; }

        public required List<string> WarrantyCardIdList { get; set; }
    }
}
