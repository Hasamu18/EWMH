using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Queries
{
    public class GetCustomerFeedbackListQuery : IRequest<(int,object)>
    {        

        public int PageIndex{ get; set; }

        public int PageSize{ get; set; }

        public GetCustomerFeedbackListQuery(int pageIndex, int pageSize)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
        }
    }
}
