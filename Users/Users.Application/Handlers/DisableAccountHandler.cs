using FirebaseAdmin.Auth;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Domain.IRepositories;
using static Logger.Utility.Constants;

namespace Users.Application.Handlers
{
    public class DisableAccountHandler : IRequestHandler<DisableAccountCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public DisableAccountHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(DisableAccountCommand request, CancellationToken cancellationToken)
        {
            var existingUser = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(request.AccountId))).ToList();
            if (!existingUser.Any())
                return (404, "Người dùng không tồn tại");

            if (existingUser[0].Role.Equals(Role.AdminRole) ||
                existingUser[0].Role.Equals(Role.ManagerRole))
                return (409, $"Vai trò {existingUser[0].Role} không thể bị vô hiệu hóa");

            if (existingUser[0].Role.Equals(Role.WorkerRole))
            {
                var getWorker = (await _uow.WorkerRepo.GetAsync(a => a.WorkerId.Equals(request.AccountId))).ToList();
                if (getWorker[0].LeaderId != null)
                    return (409, $"Nhân viên này phải được bỏ gán khỏi trưởng nhóm để có thể vô hiệu hóa");
            }

            if (existingUser[0].Role.Equals(Role.TeamLeaderRole))
            {
                var getLeader = (await _uow.ApartmentAreaRepo.GetAsync(a => a.LeaderId.Equals(request.AccountId))).ToList();
                if (getLeader.Count != 0)
                    return (409, $"Trưởng nhóm này phải được bỏ gán khỏi chung cư đang quản lý để có thể vô hiệu hóa");
                var getWorker = (await _uow.WorkerRepo.GetAsync(a => (a.LeaderId ?? "").Equals(request.AccountId))).ToList();
                if (getWorker.Count != 0)
                    return (409, $"Toàn bộ nhân viên phải được bỏ gán khỏi trưởng nhóm này để có thể vô hiệu hóa");
            }

            existingUser[0].IsDisabled = request.Disable;
            existingUser[0].DisabledReason = request.DisabledReason;

            await _uow.AccountRepo.UpdateAsync(existingUser[0]);

            if (request.Disable)
                return (200, $"{existingUser[0].FullName} đã được vô hiệu hóa");
            return (200, $"{existingUser[0].FullName} đã được kích hoạt");
        }
    }
}
