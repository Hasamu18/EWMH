using MediatR;
using Microsoft.Extensions.Configuration;
using Sales.Application.Commands;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    internal class CancelSPOfflinePaymentHandler : IRequestHandler<CancelSPOfflinePaymentCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public CancelSPOfflinePaymentHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(CancelSPOfflinePaymentCommand request, CancellationToken cancellationToken)
        {
            var existingContract = await _uow.ContractRepo.GetByIdAsync(request.ContractId);
            if (existingContract == null)
                return (404, "Contract does not exist");

            if (!existingContract.CustomerId.Equals(request.CustomerId))
                return (409, "This contract is not yours");

            if (existingContract.IsOnlinePayment)
                return (409, "You have paid for this contract, it cannot be canceled");

            await _uow.ContractRepo.DeleteFileToStorageAsync(existingContract.ContractId, _config);
            await _uow.ContractRepo.RemoveAsync(existingContract);

            return (200, "You canceled successfully");
        }
    }
}
