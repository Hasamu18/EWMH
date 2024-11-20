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
                return (404, "Hợp đồng không tồn tại");

            if (existingContract.IsOnlinePayment)
                return (409, "Bạn đã thanh toán cho hợp đồng này, không thể hủy");

            var existingTransaction = await _uow.TransactionRepo.GetByIdAsync(request.ContractId);
            if (existingTransaction != null)
                return (409, "Bạn đã thanh toán cho hợp đồng này, không thể hủy");

            await _uow.ContractRepo.DeleteFileToStorageAsync(existingContract.ContractId, _config);
            await _uow.ContractRepo.RemoveAsync(existingContract);

            return (200, "Bạn đã hủy thành công");
        }
    }
}
