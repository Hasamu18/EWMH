using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Queries;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class GetPagedRoomsHandler : IRequestHandler<GetPagedRoomsQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedRoomsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetPagedRoomsQuery request, CancellationToken cancellationToken)
        {
            var items = await _uow.RoomRepo.GetAsync(
    filter: s => s.AreaId.Equals(request.AreaId),
    includeProperties: "Customers",
    pageIndex: request.PageIndex,
    pageSize: request.Pagesize);

            var result = new List<object>();
            foreach (var item in items)
            {
                var customerId = item.Customers.Any()
                    ? item.Customers.Select(s => s.CustomerId).FirstOrDefault()
                    : null;

                var customerAccount = customerId != null
                    ? await _uow.AccountRepo.GetByIdAsync(customerId)
                    : null;

                result.Add(new
                {
                    item.AreaId,
                    item.RoomId,
                    item.RoomCode,
                    Customer = customerAccount?.FullName
                });
            }

            return result;

        }
    }
}
