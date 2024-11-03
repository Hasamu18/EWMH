using MediatR;
using Sales.Application.Queries;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    internal class GetAllPendingContractsHandler : IRequestHandler<GetAllPendingContractsQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetAllPendingContractsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetAllPendingContractsQuery request, CancellationToken cancellationToken)
        {
            var getPendingContracts = (await _uow.ContractRepo.GetAsync(a => a.OrderCode == 2)).ToList();
            return getPendingContracts;
        }
    }
}
