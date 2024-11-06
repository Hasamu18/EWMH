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
    internal class GetPagedWorkersHandler : IRequestHandler<GetPagedWorkersQuery, List<object>>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedWorkersHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<List<object>> Handle(GetPagedWorkersQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<Accounts> items;
            var result = new List<object>();
            int count = 0;
            if (request.SearchByPhone == null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals("WORKER") &&
                                                            s.IsDisabled == request.IsDisabled,
                                                            pageIndex: request.PageIndex,
                                                            pageSize: request.Pagesize);
                count = (await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals("WORKER") &&
                                                            s.IsDisabled == request.IsDisabled)).Count();
            }
            else
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals("WORKER") &&
                                                            s.PhoneNumber.Contains(request.SearchByPhone!) &&
                                                            s.IsDisabled == request.IsDisabled,
                                                            pageIndex: request.PageIndex,
                                                            pageSize: request.Pagesize);
                count = (await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals("WORKER") &&
                                                            s.PhoneNumber.Contains(request.SearchByPhone!) &&
                                                            s.IsDisabled == request.IsDisabled)).Count();
            }

            foreach (var item in items)
            {
                var getLeader = await _uow.WorkerRepo.GetByIdAsync(item.AccountId);
                if (getLeader!.LeaderId != null)
                {
                    var getLeaderInfo = await _uow.AccountRepo.GetByIdAsync(getLeader.LeaderId);
                    result.Add(new
                    {
                        item,
                        getLeaderInfo
                    });
                    continue;
                }
                   
                result.Add(new
                {
                    item
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
