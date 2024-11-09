using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetStatisticsQuery : IRequest<List<object>>
    {
        public int StartYear { get; set; } = 2021;
        public int EndYear { get; set; } = 2024;
    }
}
