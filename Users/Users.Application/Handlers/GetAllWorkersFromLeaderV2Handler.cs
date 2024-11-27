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
    internal class GetAllWorkersFromLeaderV2Handler : IRequestHandler<GetAllWorkersFromLeaderV2Query, object>
    {
        private readonly IUnitOfWork _uow;
        public GetAllWorkersFromLeaderV2Handler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetAllWorkersFromLeaderV2Query request, CancellationToken cancellationToken)
        {
            var result = new List<object>();
            var items = (await _uow.WorkerRepo.GetAsync(a => (a.LeaderId ?? "").Equals(request.LeaderId))).ToList();
            foreach (var item in items)
            {
                var getWorker = await _uow.AccountRepo.GetByIdAsync(item.WorkerId);
                result.Add(new
                {
                    getWorker!.AccountId,
                    getWorker.FullName,
                    getWorker.Email,
                    getWorker.PhoneNumber,
                    getWorker.AvatarUrl,
                    getWorker.DateOfBirth
                });
            }
            return result;
        }
    }
}
