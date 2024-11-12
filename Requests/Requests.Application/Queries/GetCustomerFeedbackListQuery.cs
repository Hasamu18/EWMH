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

        public string AccountId { get; set; } = null!;
        public int PageIndex{ get; set; }

        public int PageSize{ get; set; }

        public GetCustomerFeedbackListQuery(string accountId,int pageIndex, int pageSize)
        {
            AccountId = accountId;
            PageIndex = pageIndex;
            PageSize = pageSize;
        }
    }
}
