using MediatR;
using Sales.Application.Queries;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    internal class GetPagedShippingOrdersHandler : IRequestHandler<GetPagedShippingOrdersQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedShippingOrdersHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetPagedShippingOrdersQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<Shipping> items;
            var result = new List<object>();
            int count = 0;

            if (request.SearchByPhone == null)
            {
                items = await _uow.ShippingRepo.GetAsync(filter: c => c.Status == request.Status && c.LeaderId.Equals(request.LeaderId),
                                                         orderBy: s => s.OrderByDescending(d => d.ShipmentDate),
                                                         pageIndex: request.PageIndex,
                                                         pageSize: request.Pagesize);
                count = (await _uow.ShippingRepo.GetAsync(filter: c => c.Status == request.Status && c.LeaderId.Equals(request.LeaderId))).Count();
            }
            else
            {
                var customerIds = (await _uow.AccountRepo.GetAsync(c => c.PhoneNumber.Contains(request.SearchByPhone)))
                    .Select(c => c.AccountId)
                    .ToList();
                if (customerIds.Any())
                {
                    items = await _uow.ShippingRepo.GetAsync(
                        filter: a => customerIds.Contains(a.CustomerId) && a.Status == request.Status && a.LeaderId.Equals(request.LeaderId),
                        orderBy: s => s.OrderByDescending(d => d.ShipmentDate),
                        pageIndex: request.PageIndex,
                        pageSize: request.Pagesize
                    );
                    count = (await _uow.ShippingRepo.GetAsync(filter: a => customerIds.Contains(a.CustomerId) && a.Status == request.Status && a.LeaderId.Equals(request.LeaderId))).Count();
                }
                else
                {
                    items = [];
                    count = 0;
                }
            }

            foreach (var item in items)
            {
                var getCusInfo = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(item.CustomerId),
                                                                 includeProperties: "Customers")).First();
                var getOrder = await _uow.OrderRepo.GetByIdAsync(item.ShippingId);
                result.Add(new
                {
                    Item = new
                    {
                        Shipping = item,
                        Order = new
                        {
                            getOrder?.OrderId,
                            getOrder?.CustomerId,
                            getOrder?.PurchaseTime,
                            getOrder?.FileUrl
                        }
                    },
                    getCusInfo = new
                    {
                        getCusInfo.AccountId,
                        getCusInfo.FullName,
                        getCusInfo.Email,
                        getCusInfo.PhoneNumber,
                        getCusInfo.AvatarUrl,
                        getCusInfo.DateOfBirth,
                        getCusInfo.Customers!.CMT_CCCD
                    }
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
