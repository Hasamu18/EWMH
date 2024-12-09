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
    public class GetPagedAccountHandler : IRequestHandler<GetPagedAccountQuery, List<object>>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedAccountHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }
        public async Task<List<object>> Handle(GetPagedAccountQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<object> items;
            int count = 0;
            if (request.SearchByEmail == null && request.Role == null && request.IsDisabled == null)
            {
                items = await _uow.AccountRepo.GetAsync(orderBy: q => q.OrderByDescending(x => x.AccountId),
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.AccountRepo.GetAsync()).Count();
            }
            else if (request.SearchByEmail == null && request.Role != null && request.IsDisabled == null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals(request.Role),
                                                        orderBy: q => q.OrderByDescending(x => x.AccountId),
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals(request.Role))).Count();
            }
            else if (request.SearchByEmail == null && request.Role != null && request.IsDisabled != null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals(request.Role) &&
                                                                s.IsDisabled == request.IsDisabled,
                                                        orderBy: q => q.OrderByDescending(x => x.AccountId),
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals(request.Role) &&
                                                                s.IsDisabled == request.IsDisabled)).Count();
            }
            else if (request.SearchByEmail == null && request.Role == null && request.IsDisabled != null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.IsDisabled == request.IsDisabled,
                                                        orderBy: q => q.OrderByDescending(x => x.AccountId),
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.AccountRepo.GetAsync(filter: s => s.IsDisabled == request.IsDisabled)).Count();
            }
            else if (request.SearchByEmail != null && request.Role == null && request.IsDisabled == null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Email.Contains(request.SearchByEmail),
                                                        orderBy: q => q.OrderByDescending(x => x.AccountId),
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.AccountRepo.GetAsync(filter: s => s.Email.Contains(request.SearchByEmail))).Count();
            }
            else if (request.SearchByEmail != null && request.Role != null && request.IsDisabled == null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Email.Contains(request.SearchByEmail) &&
                                                                s.Role.Equals(request.Role),
                                                        orderBy: q => q.OrderByDescending(x => x.AccountId),
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.AccountRepo.GetAsync(filter: s => s.Email.Contains(request.SearchByEmail) &&
                                                                s.Role.Equals(request.Role))).Count();
            }
            else if (request.SearchByEmail != null && request.Role != null && request.IsDisabled != null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Email.Contains(request.SearchByEmail) &&
                                                                s.Role.Equals(request.Role) &&
                                                                s.IsDisabled == request.IsDisabled,
                                                        orderBy: q => q.OrderByDescending(x => x.AccountId),
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.AccountRepo.GetAsync(filter: s => s.Email.Contains(request.SearchByEmail) &&
                                                                s.Role.Equals(request.Role) &&
                                                                s.IsDisabled == request.IsDisabled)).Count();
            }
            else
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Email.Contains(request.SearchByEmail!) &&
                                                                s.IsDisabled == request.IsDisabled,
                                                        orderBy: q => q.OrderByDescending(x => x.AccountId),
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
                count = (await _uow.AccountRepo.GetAsync(filter: s => s.Email.Contains(request.SearchByEmail!) &&
                                                                s.IsDisabled == request.IsDisabled)).Count();
            }

            return new()
            {
                items.ToList(),
                count
            };
        }
    }
}
