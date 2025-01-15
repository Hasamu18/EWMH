using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Mappers;
using Users.Application.Responses;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class UpdateAccountHandler : IRequestHandler<UpdateAccountCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public UpdateAccountHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
        {
            var existingUser = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(request.AccountId))).ToList();
            if (!existingUser.Any())
                return (404, "Người dùng không tồn tại");

            var existingEmail = await _uow.AccountRepo.GetAsync(a => a.Email.Equals(request.Email));
            if (existingEmail.Any() && !existingUser.ToList()[0].Email.Equals(request.Email))
                return (409, $"Email: {request.Email} đang tồn tại");

            existingUser[0].FullName = request.FullName;
            existingUser[0].Email = request.Email;
            existingUser[0].DateOfBirth = request.DateOfBirth;
            await _uow.AccountRepo.UpdateAsync(existingUser[0]);

            return (200, "Đã cập nhật thành công");
        }
    }
}
