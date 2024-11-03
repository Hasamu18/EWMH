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
    public class GetPagedRoomsHandler : IRequestHandler<GetPagedRoomsQuery, List<object>>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedRoomsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<List<object>> Handle(GetPagedRoomsQuery request, CancellationToken cancellationToken)
        {
            var items = await _uow.RoomRepo.GetAsync(
    filter: s => s.AreaId.Equals(request.AreaId),
    pageIndex: request.PageIndex,
    pageSize: request.Pagesize);

            var result = new List<object>();
            int count = (await _uow.RoomRepo.GetAsync(
    filter: s => s.AreaId.Equals(request.AreaId))).Count();

            foreach (var item in items)
            {
                var customerAccount = item.CustomerId != null
                    ? await _uow.AccountRepo.GetByIdAsync(item.CustomerId)
                    : null;

                result.Add(new
                {
                    item.AreaId,
                    item.RoomId,
                    Customer = customerAccount?.FullName
                });
            }

            return new()
{
    result,
    count
};

        }
    }
}
