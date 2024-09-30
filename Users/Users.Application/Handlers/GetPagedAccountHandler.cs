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
    public class GetPagedAccountHandler : IRequestHandler<GetPagedAccountQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedAccountHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }
        public async Task<object> Handle(GetPagedAccountQuery request, CancellationToken cancellationToken)
        {
            List<string> searchFields = ["Email", "DisplayName"];
            List<string> returnFields = [];

            var items = await _uow.AccountRepo.GetPagedListAsync(request.PageIndex, request.Pagesize, request.IsAsc, request.SortField, request.SearchValue, searchFields, returnFields);
            return items;
        }
    }
}
