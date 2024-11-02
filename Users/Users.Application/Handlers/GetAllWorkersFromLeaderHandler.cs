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
    internal class GetAllWorkersFromLeaderHandler : IRequestHandler<GetAllWorkersFromLeaderQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetAllWorkersFromLeaderHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetAllWorkersFromLeaderQuery request, CancellationToken cancellationToken)
        {
            var result = new List<object>();
            var items = (await _uow.WorkerRepo.GetAsync(a => (a.LeaderId ?? "").Equals(request.LeaderId))).ToList();
            foreach (var item in items)
            {
                var getWorker = await _uow.AccountRepo.GetByIdAsync(item.WorkerId);
                result.Add(getWorker!);
            }
            return result;
        }
    }
}
