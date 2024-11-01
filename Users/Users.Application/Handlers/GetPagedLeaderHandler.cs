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
    public class GetPagedLeaderHandler : IRequestHandler<GetPagedLeaderQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedLeaderHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetPagedLeaderQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<Accounts> items;
            var result = new List<object>();
            if (request.SearchByEmail == null && request.IsDisabled == null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals("LEADER"),
                                                            pageIndex: request.PageIndex,
                                                            pageSize: request.Pagesize);
                int count = (await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals("LEADER"))).Count();
                result.Add(count);
            }
            else if (request.SearchByEmail == null && request.IsDisabled != null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals("LEADER") &&
                                                            s.IsDisabled == request.IsDisabled,
                                                            pageIndex: request.PageIndex,
                                                            pageSize: request.Pagesize);
                int count = (await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals("LEADER") &&
                                                            s.IsDisabled == request.IsDisabled)).Count();
                result.Add(count);
            }
            else if (request.SearchByEmail != null && request.IsDisabled == null)
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals("LEADER") && 
                                                            s.Email.Contains(request.SearchByEmail),
                                                            pageIndex: request.PageIndex,
                                                            pageSize: request.Pagesize);
                int count = (await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals("LEADER") &&
                                                            s.Email.Contains(request.SearchByEmail))).Count();
                result.Add(count);
            }
            else
            {
                items = await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals("LEADER") &&
                                                            s.Email.Contains(request.SearchByEmail!) &&
                                                            s.IsDisabled == request.IsDisabled,
                                                            pageIndex: request.PageIndex,
                                                            pageSize: request.Pagesize);
                int count = (await _uow.AccountRepo.GetAsync(filter: s => s.Role.Equals("LEADER") &&
                                                            s.Email.Contains(request.SearchByEmail!) &&
                                                            s.IsDisabled == request.IsDisabled)).Count();
                result.Add(count);
            }

            foreach (var get in items)
            {
                var apartment = (await _uow.ApartmentAreaRepo.GetAsync(s => s.LeaderId.Equals(get.AccountId))).ToList();
                if (apartment.Count == 0)
                {
                    result.Add(new
                    {
                        get.AccountId,
                        get.FullName,
                        get.Email,
                        get.PhoneNumber,
                        get.AvatarUrl,
                        get.DateOfBirth,
                        get.IsDisabled,
                        get.DisabledReason,
                        get.Role,
                        AreaId = "null",
                        ApartmentName = "null"
                    });
                }
                else
                {
                    result.Add(new
                    {
                        get.AccountId,
                        get.FullName,
                        get.Email,
                        get.PhoneNumber,
                        get.AvatarUrl,
                        get.DateOfBirth,
                        get.IsDisabled,
                        get.DisabledReason,
                        get.Role,
                        apartment[0].AreaId,
                        apartment[0].Name
                    });
                }                
            }

            return result;
        }
    }
}
