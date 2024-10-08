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
    public class GetPagedAccountHandler : IRequestHandler<GetPagedAccountQuery, List<Accounts>>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedAccountHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }
        public async Task<List<Accounts>> Handle(GetPagedAccountQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<Accounts> items;
            if (request.SearchByEmail == null && request.Role == null && request.IsDisabled == null)
            {
                items = await _uow.AccountRepo.GetAsync(pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
            }
            else if (request.SearchByEmail == null && request.Role != null && request.IsDisabled == null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals(request.Role),
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
            }
            else if (request.SearchByEmail == null && request.Role != null && request.IsDisabled != null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals(request.Role) &&
                                                                s.IsDisabled == request.IsDisabled,
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
            }
            else if (request.SearchByEmail == null && request.Role == null && request.IsDisabled != null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.IsDisabled == request.IsDisabled,
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
            }
            else if (request.SearchByEmail != null && request.Role == null && request.IsDisabled == null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Email.Contains(request.SearchByEmail),
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
            }
            else if (request.SearchByEmail != null && request.Role != null && request.IsDisabled == null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Email.Contains(request.SearchByEmail) &&
                                                                s.Role.Equals(request.Role),
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
            }
            else if (request.SearchByEmail != null && request.Role != null && request.IsDisabled != null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Email.Contains(request.SearchByEmail) &&
                                                                s.Role.Equals(request.Role) &&
                                                                s.IsDisabled == request.IsDisabled,
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
            }
            else
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Email.Contains(request.SearchByEmail!) &&
                                                                s.IsDisabled == request.IsDisabled,
                                                        pageIndex: request.PageIndex,
                                                        pageSize: request.Pagesize);
            }

            return items.ToList();
        }
    }
}
