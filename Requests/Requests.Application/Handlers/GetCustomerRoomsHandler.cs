using MediatR;
using Requests.Application.Queries;
using Requests.Domain.Entities;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Handlers
{
    internal class GetCustomerRoomsHandler : IRequestHandler<GetCustomerRoomsQuery, (int, object)>
    {
        private readonly IUnitOfWork _uow;
        public GetCustomerRoomsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, object)> Handle(GetCustomerRoomsQuery request, CancellationToken cancellationToken)
        {
            List<Accounts> existingUser;
            if (IsEmail(request.Email_Or_Phone))
            {
                existingUser = (await _uow.AccountRepo.GetAsync(e => e.Email.Equals(request.Email_Or_Phone))).ToList();
            }
            else
            {
                existingUser = (await _uow.AccountRepo.GetAsync(e => e.PhoneNumber.Equals(request.Email_Or_Phone))).ToList();
            }

            if (existingUser.Count == 0)
                return (404, "Người dùng không tồn tại");

            if (!existingUser[0].Role.Equals(Role.CustomerRole))
                return (409, "Chỉ có thể điền email hoặc số điện thoại của khách hàng");

            var getRooms = (await _uow.RoomRepo.GetAsync(a => (a.CustomerId ?? "").Equals(existingUser[0].AccountId), includeProperties:"Area")).ToList();

            if (!request.LeaderId.Equals(getRooms[0].Area.LeaderId))
                return (409, "Bạn chỉ có thể tạo yêu cầu sửa chữa đối với những khách hàng thuộc chung cư của bạn");

            return (200, new
            {
                existingUser,
                getRooms
            });
        }

        private bool IsEmail(string input)
        {
            var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            return emailRegex.IsMatch(input);
        }
    }
}
