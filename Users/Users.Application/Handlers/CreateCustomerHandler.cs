using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Mappers;
using Logger.Utility;
using Users.Domain.Entities;
using Users.Domain.IRepositories;
using static Logger.Utility.Constants;
using Microsoft.EntityFrameworkCore;
using Constants.Utility;

namespace Users.Application.Handlers
{
    public class CreateCustomerHandler : IRequestHandler<CreateCustomerCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public CreateCustomerHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
        {
            var pendingAccount = await _uow.PendingAccountRepo.GetByIdAsync(request.PendingAccountId);
            if (pendingAccount == null)
                return (404, "Tài khoản chờ duyệt không tồn tại");

            var existingApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.AreaId.Equals(pendingAccount.AreaId))).ToList();

            if (!request.IsApproval)
            {
                if (!string.IsNullOrEmpty(pendingAccount.Email))
                {
                    EmailSender refuseEmailSender = new(_config);
                    string refuseSubject = "Đăng ký tài khoản EWMH";
                    string refuseBody = $@"Người quản trị hệ thống đã từ chối duyệt tài khoản của bạn với lý do {request.Reason}";
                    await refuseEmailSender.SendEmailAsync(pendingAccount.Email, refuseSubject, refuseBody);
                }
                await _uow.PendingAccountRepo.RemoveAsync(pendingAccount);

                return (200, $"Bạn đã từ chối yêu cầu tạo tài khoản với lý do {request.Reason}");
            }
                
            List<Rooms> customerRooms = [];
            foreach (var roomId in request.RoomIds)
            {
                var existingRoom = (await _uow.RoomRepo.GetAsync(a => a.AreaId.Equals(pendingAccount.AreaId) &&
                                                                      a.RoomId.Equals(roomId))).ToList();
                if (existingRoom.Count == 0)
                    return (404, $"Mã phòng: {roomId} không tồn tại ");

                if (!string.IsNullOrEmpty(existingRoom[0].CustomerId))
                    return (409, $"Mã phòng: {roomId} đang được liên kết với tài khoản khác");

                customerRooms.Add(existingRoom[0]);
            }

            var account = UserMapper.Mapper.Map<Accounts>(request);
            account.AccountId = $"C_{await _uow.CustomerRepo.Query().CountAsync() + 1:D10}";
            account.FullName = pendingAccount.FullName.Split("||")[0].Trim();
            account.Email = pendingAccount.Email;
            account.Password = Tools.HashString(pendingAccount.Password);
            account.AvatarUrl = $"https://firebasestorage.googleapis.com/v0/b/{_config["bucket_name"]}/o/default1.png?alt=media";
            account.PhoneNumber = pendingAccount.PhoneNumber;
            account.DateOfBirth = pendingAccount.DateOfBirth;
            account.IsDisabled = false;
            account.DisabledReason = null;
            account.Role = Role.CustomerRole;
            await _uow.AccountRepo.AddAsync(account);

            Customers customer = new Customers()
            {
                CustomerId = account.AccountId,
                CMT_CCCD = pendingAccount.CMT_CCCD
            };
            await _uow.CustomerRepo.AddAsync(customer);

            foreach (var customerRoom in customerRooms)
            {
                customerRoom.CustomerId = account.AccountId;
                await _uow.RoomRepo.UpdateAsync(customerRoom);
            }

            await _uow.PendingAccountRepo.RemoveAsync(pendingAccount);

            if (!string.IsNullOrEmpty(pendingAccount.Email))
            {
                EmailSender emailSender = new(_config);
                string subject = "Đăng ký tài khoản EWMH";
                string body = $"Tài khoản EWMH với CMT/CCCD: {pendingAccount.CMT_CCCD} đã được duyệt và được tạo thành công, hãy trải nghiệm dịch vụ của chúng tôi";
                await emailSender.SendEmailAsync(pendingAccount.Email, subject, body);
            }

            return (201, $"Tài khoản khách hàng đã được tạo");
        }
    }
}
