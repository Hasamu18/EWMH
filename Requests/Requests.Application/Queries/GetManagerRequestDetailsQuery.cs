using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Queries
{
    public class GetManagerRequestDetailsQuery : IRequest<object>
    {
       public string RequestId { get; set; }    
    }
}
