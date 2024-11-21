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
    internal class GetFreeLeadersHandler : IRequestHandler<GetFreeLeadersQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetFreeLeadersHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetFreeLeadersQuery request, CancellationToken cancellationToken)
        {
            var leaders = (await _uow.LeaderRepo.GetAsync()).ToHashSet().Select(s => s.LeaderId);
            var busyLeaders = (await _uow.ApartmentAreaRepo.GetAsync()).ToHashSet().Select(s => s.LeaderId);
            var freeLeaders = leaders.Except(busyLeaders);
            var freeLeadersInfo = (await _uow.AccountRepo.GetAsync(s => freeLeaders.Contains(s.AccountId) && !s.IsDisabled)).ToList()
                                                         .Select(s => new
                                                         {
                                                             s.AccountId,
                                                             s.FullName,
                                                             s.Email,
                                                             s.PhoneNumber,
                                                             s.AvatarUrl,
                                                             s.DateOfBirth
                                                         });
            return freeLeadersInfo;
        }
    }
}
