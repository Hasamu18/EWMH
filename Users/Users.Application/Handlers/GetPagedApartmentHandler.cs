using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Queries;
using Users.Application.Responses;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class GetPagedApartmentHandler : IRequestHandler<GetPagedApartmentQuery, List<object>>
    {
        private readonly IUnitOfWork _uow;
        public GetPagedApartmentHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<List<object>> Handle(GetPagedApartmentQuery request, CancellationToken cancellationToken)
        {
            var result = new List<object>();
            int count = 0;
            if (request.SearchByName == null)
            {
                var items = await _uow.ApartmentAreaRepo.GetAsync(orderBy: q => q.OrderByDescending(a => a.AreaId), pageIndex: request.PageIndex,
                                                                  pageSize: request.Pagesize, includeProperties:"Rooms");
                count = (await _uow.ApartmentAreaRepo.GetAsync()).Count();

                foreach (var get in items)
                {
                    var account = await _uow.AccountRepo.GetByIdAsync(get.LeaderId);

                    result.Add(new
                    {
                        get.AreaId,
                        get.LeaderId,
                        Account = account,
                        get.Name,
                        get.Description,
                        get.Address,
                        get.ManagementCompany,
                        get.AvatarUrl,
                        RoomIds = get.Rooms.Select(s => s.RoomId).ToList()
                    });
                }
            }
            else
            {
                var items = await _uow.ApartmentAreaRepo.GetAsync(
                    filter: s => s.Name.Contains(request.SearchByName),
                    pageIndex: request.PageIndex,
                    pageSize: request.Pagesize, includeProperties: "Rooms");
                count = (await _uow.ApartmentAreaRepo.GetAsync(filter: s => s.Name.Contains(request.SearchByName))).Count();

                foreach (var get in items.Reverse())
                {
                    var account = await _uow.AccountRepo.GetByIdAsync(get.LeaderId);

                    result.Add(new
                    {
                        get.AreaId,
                        get.LeaderId,
                        Account = account,
                        get.Name,
                        get.Description,
                        get.Address,
                        get.ManagementCompany,
                        get.AvatarUrl,
                        RoomIds = get.Rooms.Select(s => s.RoomId).ToList()
                    });
                }
            }

            return new()
            {
                result,
                count
            }; 

        }
    }
}
