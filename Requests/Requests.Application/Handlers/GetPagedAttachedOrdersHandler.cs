using MediatR;
using Requests.Application.Queries;
using Requests.Domain.Entities;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Handlers
{
    internal class GetPagedAttachedOrdersHandler : IRequestHandler<GetPagedAttachedOrdersQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedAttachedOrdersHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetPagedAttachedOrdersQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<Requests.Domain.Entities.Requests> items;
            var result = new List<object>();
            int count = 0;

            Func<IQueryable<Requests.Domain.Entities.Requests>, IOrderedQueryable<Requests.Domain.Entities.Requests>> orderBy = request.DescreasingDateSort
            ? o => o.OrderByDescending(d => d.PurchaseTime)
            : o => o.OrderBy(d => d.PurchaseTime);

            if (request.SearchByPhone == null)
            {
                items = await _uow.RequestRepo.GetAsync(filter: a => a.Status == 2 && a.CategoryRequest == 1,
                                                         orderBy: orderBy,
                                                         pageIndex: request.PageIndex,
                                                         pageSize: request.Pagesize);
                count = (await _uow.RequestRepo.GetAsync(filter: a => a.Status == 2 && a.CategoryRequest == 1)).Count();
            }
            else
            {
                var customerIds = (await _uow.AccountRepo.GetAsync(c => c.PhoneNumber.Contains(request.SearchByPhone)))
                    .Select(c => c.AccountId)
                    .ToList();
                if (customerIds.Any())
                {
                    items = await _uow.RequestRepo.GetAsync(
                        filter: a => customerIds.Contains(a.CustomerId) && a.Status == 2 && a.CategoryRequest == 1,
                        orderBy: orderBy,
                        pageIndex: request.PageIndex,
                        pageSize: request.Pagesize
                    );
                    count = (await _uow.RequestRepo.GetAsync(filter: a => customerIds.Contains(a.CustomerId) && a.Status == 2 && a.CategoryRequest == 1)).Count();
                }
                else
                {
                    items = Enumerable.Empty<Requests.Domain.Entities.Requests>();
                    count = 0;
                }
            }

            foreach (var item in items)
            {
                var getCusLeaInfo = await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(item.CustomerId) || a.AccountId.Equals(item.LeaderId));
                result.Add(new
                {
                    Order = new
                    {
                        item.RequestId,
                        item.PurchaseTime,
                        item.FileUrl,
                        item.OrderCode,
                        item.TotalPrice
                    },
                    Customer_Leader = getCusLeaInfo
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
