using Logger.Utility;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Domain.Entities;
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
            if (request.LeaderId != null)
            {
                if (getLeader.Count == 0)
                    return (404, $"Trưởng nhóm này không tồn tại");
                if (getLeader[0].IsDisabled)
                    return (409, "Trưởng nhóm này đã bị vô hiệu hóa, không thể gán");

                var getArea = (await _uow.ApartmentAreaRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId))).FirstOrDefault();
                if (getArea == null)
                    return (409, "Trưởng nhóm này chưa quản lý bất kỳ chung cư nào, không thể gán nhân viên vào trưởng nhóm này");

                if (getWorker[0].LeaderId != request.LeaderId)
                {
                    var time = Tools.GetDynamicTimeZone(); ;
                    var getCurrent = (await _uow.WorkerHistoryRepo.GetAsync(a => a.WorkerId.Equals(getWorker[0].WorkerId) &&
                                                                                 a.To == null)).FirstOrDefault();
                    if (getCurrent != null)
                    {
                        getCurrent.To = time;
                        await _uow.WorkerHistoryRepo.UpdateAsync(getCurrent);
                    }                    

                    var workerHistoryId = $"WH_{await _uow.WorkerHistoryRepo.Query().CountAsync() + 1:D10}";
                    WorkerHistory workerHistory = new()
                    {
                        WorkerHistoryId = workerHistoryId,
                        WorkerId = request.WorkerId,
                        LeaderId = request.LeaderId,
                        From = time
                    };
                    await _uow.WorkerHistoryRepo.AddAsync(workerHistory);
                }
            }
            if (request.LeaderId == null)
            {
                var time = Tools.GetDynamicTimeZone(); ;
                var getCurrent = (await _uow.WorkerHistoryRepo.GetAsync(a => a.WorkerId.Equals(getWorker[0].WorkerId) &&
                                                                             a.To == null)).FirstOrDefault();
                if (getCurrent != null)
                {
                    getCurrent.To = time;
                    await _uow.WorkerHistoryRepo.UpdateAsync(getCurrent);
                }
            }

            var getWorkerStatus = await _uow.AccountRepo.GetByIdAsync(request.WorkerId);
            if (getWorkerStatus!.IsDisabled)
                return (409, "Nhân viên này đã bị vô hiệu hóa, không thể gán");            

            getWorker[0].LeaderId = request.LeaderId;
            await _uow.WorkerRepo.UpdateAsync(getWorker[0]);

            return (200, "Đã gán thành công");
        }
    }
}
