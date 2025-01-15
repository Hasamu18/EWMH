using MediatR;
using Requests.Application.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Queries
{
    public class GetLeaderDetailsQuery : IRequest<LeaderDetails>
    {
        public string CustomerId { get; set; }
       

        public GetLeaderDetailsQuery(string customerId)
        {
            CustomerId = customerId;            
        }
    }
}
