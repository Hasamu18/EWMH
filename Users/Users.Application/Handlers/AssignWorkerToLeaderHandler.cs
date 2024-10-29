using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    internal class AssignWorkerToLeaderHandler : IRequestHandler<AssignWorkerToLeaderCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public AssignWorkerToLeaderHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(AssignWorkerToLeaderCommand request, CancellationToken cancellationToken)
        {
            var getWorker = (await _uow.WorkerRepo.GetAsync(a => a.WorkerId.Equals(request.WorkerId))).ToList();
            if (getWorker.Count == 0)
                return (404, $"Nhân viên này không tồn tại");

            var getLeader = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(request.LeaderId))).ToList();
            if (getLeader.Count == 0)
                return (404, $"Trưởng nhóm này không tồn tại");

            var getWorkerStatus = await _uow.AccountRepo.GetByIdAsync(request.WorkerId);
            if (getWorkerStatus!.IsDisabled)
                return (409, "Nhân viên này đã bị vô hiệu hóa, không thể gán");

            if (getLeader[0].IsDisabled)
                return (409, "Trưởng nhóm này đã bị vô hiệu hóa, không thể gán");

            getWorker[0].LeaderId = request.LeaderId;
            await _uow.WorkerRepo.UpdateAsync(getWorker[0]);

            return (200, "Đã gán thành công");
        }
    }
}
