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
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 6;
        public string SortByStarOrder { get; set; } = "desc";
        public int Status { get; set; } = 2;

        public GetCustomerFeedbackListQuery(string accountId,int pageIndex, int pageSize,string sortByStarOrder,int status)
        {
            AccountId = accountId;
            PageIndex = pageIndex;
            PageSize = pageSize;
            if(sortByStarOrder!= null) SortByStarOrder = sortByStarOrder;
            Status = status;
        }
    }
}
