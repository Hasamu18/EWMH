using Constants.Utility;
using Logger.Utility;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Sales.Application.Commands;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    internal class ScanContractHandler : IRequestHandler<ScanContractCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public ScanContractHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(ScanContractCommand request, CancellationToken cancellationToken)
        {
            var existingContract = await _uow.ContractRepo.GetByIdAsync(request.ContractId);
            if (existingContract == null)
                return (404, "Contract does not exist");

            var infoCustomer = await _uow.AccountRepo.GetByIdAsync(existingContract.CustomerId);

            var existingServicePackage = (await _uow.ServicePackageRepo.GetAsync(a => a.ServicePackageId.Equals(existingContract.ServicePackageId),
                                                                   includeProperties: "ServicePackagePrices")).ToList();
            var currentServicePackage = existingServicePackage[0].ServicePackagePrices.OrderByDescending(p => p.Date).First();

            var bucketAndPath = await _uow.ContractRepo.UploadFileToStorageAsync(request.ContractId, request.File, _config);
            existingContract.FileUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";

            if (!existingContract.IsOnlinePayment)
            {
                existingContract.PurchaseTime = Tools.GetDynamicTimeZone();
                existingContract.TotalPrice = currentServicePackage.PriceByDate;

                var existingTransaction = (await _uow.TransactionRepo.GetAsync(e => e.ServiceId!.Equals(request.ContractId))).ToList();
                if (existingTransaction.Count == 0)
                {
                    Transaction transaction = new()
                    {
                        TransactionId = $"T_{await _uow.TransactionRepo.Query().CountAsync() + 1:D10}",
                        ServiceId = request.ContractId,
                        ServiceType = 1,
                        CustomerId = existingContract.CustomerId,
                        AccountNumber = null,
                        CounterAccountNumber = null,
                        CounterAccountName = null,
                        PurchaseTime = (DateTime)existingContract.PurchaseTime,
                        OrderCode = null,
                        Amount = (int)existingContract.TotalPrice,
                        Description = null
                    };
                    await _uow.TransactionRepo.AddAsync(transaction);
                }
            }

            await _uow.ContractRepo.UpdateAsync(existingContract);

            EmailSender emailSender = new(_config);
            string subject = "Contract";
            string body = $"Here, your contract";
            await emailSender.SendEmailAsync(infoCustomer!.Email, subject, body, request.File);

            return (200, "Scaned successfully");
        }
    }
}
