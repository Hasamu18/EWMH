using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Queries;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    internal class GetPagedPendingAccountsHandler : IRequestHandler<GetPagedPendingAccountsQuery, List<object>>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedPendingAccountsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<List<object>> Handle(GetPagedPendingAccountsQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<PendingAccounts> items;
            var result = new List<object>();
            int count = 0;
            if (request.SearchByPhone == null)
            {
                items = await _uow.PendingAccountRepo.GetAsync(pageIndex: request.PageIndex,
                                                               pageSize: request.Pagesize);
                count = (await _uow.PendingAccountRepo.GetAsync()).Count();
            }
            else
            {
                items = await _uow.PendingAccountRepo.GetAsync(a => a.PhoneNumber.Contains(request.SearchByPhone),
                                                               pageIndex: request.PageIndex,
                                                               pageSize: request.Pagesize);
                count = (await _uow.PendingAccountRepo.GetAsync(a => a.PhoneNumber.Contains(request.SearchByPhone))).Count();
            }

            foreach (var get in items)
            {
                var apartment = (await _uow.ApartmentAreaRepo.GetAsync(s => s.AreaId.Equals(get.AreaId))).ToList();
                result.Add(new
                {
                    get,
                    apartment
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
