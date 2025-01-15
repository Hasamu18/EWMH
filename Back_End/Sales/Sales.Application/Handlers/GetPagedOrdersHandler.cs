using MediatR;
using Sales.Application.Queries;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Google.Cloud.Firestore.V1.StructuredQuery.Types;

namespace Sales.Application.Handlers
{
    internal class GetPagedOrdersHandler : IRequestHandler<GetPagedOrdersQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedOrdersHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetPagedOrdersQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<Orders> items;
            var result = new List<object>();
            int count = 0;

            Func<IQueryable<Orders>, IOrderedQueryable<Orders>> orderBy = request.DescreasingDateSort
            ? o => o.OrderByDescending(d => d.PurchaseTime)
            : o => o.OrderBy(d => d.PurchaseTime);

            if (request.SearchByPhone == null)
            {
                items = await _uow.OrderRepo.GetAsync(filter: a => a.Status == true,
                                                         orderBy: orderBy,
                                                         includeProperties: "OrderDetails",
                                                         pageIndex: request.PageIndex,
                                                         pageSize: request.Pagesize);
                count = (await _uow.OrderRepo.GetAsync(filter: a => a.Status == true)).Count();
            }
            else
            {
                var customerIds = (await _uow.AccountRepo.GetAsync(c => c.PhoneNumber.Contains(request.SearchByPhone)))
                    .Select(c => c.AccountId)
                    .ToList();
                if (customerIds.Any())
                {
                    items = await _uow.OrderRepo.GetAsync(
                        filter: a => customerIds.Contains(a.CustomerId) && a.Status == true,
                        orderBy: orderBy,
                        includeProperties: "OrderDetails",
                        pageIndex: request.PageIndex,
                        pageSize: request.Pagesize
                    );
                    count = (await _uow.OrderRepo.GetAsync(filter: a => customerIds.Contains(a.CustomerId) && a.Status == true)).Count();
                }
                else
                {
                    items = Enumerable.Empty<Orders>();
                    count = 0;
                }
            }
            
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
