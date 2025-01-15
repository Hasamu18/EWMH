using Logger.Utility;
using MailKit.Search;
using MediatR;
using Sales.Application.Queries;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Google.Cloud.Firestore.V1.StructuredAggregationQuery.Types.Aggregation.Types;

namespace Sales.Application.Handlers
{
    internal class GetCurrentOrdersHandler : IRequestHandler<GetCurrentOrdersQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetCurrentOrdersHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetCurrentOrdersQuery request, CancellationToken cancellationToken)
        {
            var result = new List<object>();
            var items = await _uow.OrderRepo.GetAsync(filter: a => a.Status == true && a.PurchaseTime!.Value.Date == request.Date.Date,
                                                         includeProperties: "OrderDetails",
                                                         pageIndex: request.PageIndex,
                                                         pageSize: request.Pagesize);
            int count = (await _uow.OrderRepo.GetAsync(filter: a => a.Status == true && a.PurchaseTime!.Value.Date == request.Date.Date)).Count();

            foreach (var item in items)
            {
                var getCusInfo = await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(item.CustomerId));
                result.Add(new
                {
                    Order = new
                    {
                        item.OrderId,
                        item.PurchaseTime,
                        item.FileUrl,
                        item.OrderCode,
                        TotalPrice = item.OrderDetails.Select(s => s.TotalPrice).Sum()
                    },
                    Customer = getCusInfo
                });
            }

            return new
            {
                result,
                count
            };
        }
    }
}
