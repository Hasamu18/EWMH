using Constants.Utility;
using Logger.Utility;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Mappers;
using Users.Domain.Entities;
using Users.Domain.IRepositories;
using static Logger.Utility.Constants;

namespace Users.Application.Handlers
{
    internal class PendingApprovalCreateCustomerHandler : IRequestHandler<PendingApprovalCreateCustomerCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public PendingApprovalCreateCustomerHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(PendingApprovalCreateCustomerCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.Email))
                request.Email = "";

            var existingEmail = await _uow.AccountRepo.GetAsync(a => a.Email.Equals(request.Email));
            if (existingEmail.Any())
                return (409, $"Email: {request.Email} đang tồn tại");

            var existingPhone = await _uow.AccountRepo.GetAsync(a => a.PhoneNumber.Equals(request.PhoneNumber));
            if (existingPhone.Any())
                return (409, $"SĐT:{request.PhoneNumber} đang tồn tại");

            var existingApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.AreaId.Equals(request.AreaId))).ToList();
            if (existingApartment.Count == 0)
                return (404, $"Chung cư không tồn tại");

            var existingCMT_CCCD = (await _uow.CustomerRepo.GetAsync(a => a.CMT_CCCD.Equals(request.CMT_CCCD))).ToList();
            if (existingCMT_CCCD.Count != 0)
            {
                foreach (var item in existingCMT_CCCD)
                {
                    var existingAccount = (await _uow.RoomRepo.GetAsync(a => (a.CustomerId ?? "").Equals(item.CustomerId))).First();
                    (string, string) a_c = (existingAccount.AreaId, item.CMT_CCCD);
                    if (a_c == (request.AreaId, request.CMT_CCCD))
                        return (409, $"Bạn đã có tài khoản CMT/CCCD: {request.CMT_CCCD} liên kết với chung cư {existingApartment[0].Name}");
                }
            }

            var pendingAccount = UserMapper.Mapper.Map<PendingAccounts>(request);
            pendingAccount.PendingAccountId = $"PDA_{await _uow.PendingAccountRepo.Query().CountAsync() + 1:D10}";
            pendingAccount.FullName = $"{request.FullName} || {string.Join(", ", request.RoomIds)}";
            await _uow.PendingAccountRepo.AddAsync(pendingAccount);

            return (200, $"Tài khoản của bạn đang chờ duyệt, thời gian duyệt trong vòng 24 giờ");
        }
    }
}
