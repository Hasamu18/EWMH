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
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class UpdateApartmentHandler : IRequestHandler<UpdateApartmentCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public UpdateApartmentHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(UpdateApartmentCommand request, CancellationToken cancellationToken)
        {
            var existingApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.AreaId.Equals(request.AreaId))).ToList();
            if (existingApartment.Count == 0)
                return (404, "Chung cư không tồn tại");

            var existingName = await _uow.ApartmentAreaRepo.GetAsync(a => a.Name.Equals(request.Name));
            if (existingName.Any() && !existingName.ToList()[0].Name.Equals(existingApartment[0].Name))
                return (409, $"Chung cư: {request.Name} đang tồn tại, vui lòng chọn tên khác");            

            var getLeader = (await _uow.LeaderRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId))).FirstOrDefault();
            if (getLeader is null)
                return (404, "Trưởng nhóm không tồn tại");

            var getLeaderApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId))).FirstOrDefault();
            if (getLeaderApartment != null && !existingApartment[0].LeaderId.Equals(request.LeaderId))
                return (409, $"Trưởng nhóm đã được gán vào một chung cư khác");

            if (request.LeaderId != existingApartment[0].LeaderId)
            {
                var getRequestedRequests = (await _uow.RequestRepo.GetAsync(a => a.Status == 0 && a.LeaderId.Equals(existingApartment[0].LeaderId))).ToList().Count;
                if (getRequestedRequests != 0)
                    return (409, $"Trưởng nhóm {existingApartment[0].Name} vẫn còn {getRequestedRequests} yêu cầu cần xử lý, cần hoàn thành trước khi chuyển giao");

                var getCustomers = (await _uow.RoomRepo
                .GetAsync(a => a.AreaId.Equals(request.AreaId) && a.CustomerId != null))
                .Select(a => a.CustomerId)
                .Distinct()
                .ToList();

                var getProcessingContracts = (await _uow.ContractRepo.GetAsync(a => a.OrderCode == 2 && getCustomers.Contains(a.CustomerId))).ToList().Count;
                if (getProcessingContracts != 0)
                    return (409, $"Trưởng nhóm {existingApartment[0].Name} vẫn còn {getProcessingContracts} hợp đồng cần xử lý, cần hoàn thành trước khi chuyển giao");

                var getProcessingShippings = (await _uow.ShippingRepo.GetAsync(a => a.Status == 0 && a.LeaderId.Equals(existingApartment[0].LeaderId))).ToList().Count;
                if (getProcessingShippings != 0)
                    return (409, $"Trưởng nhóm {existingApartment[0].Name} vẫn còn {getProcessingShippings} đơn hàng cần phân bổ nhân viên giao hàng, cần hoàn thành trước khi chuyển giao");
            }


            if (request.Image != null)
            {
                var extensionFile = Path.GetExtension(request.Image.FileName);
                string[] extensionSupport = [".png", ".jpg"];
                if (!extensionSupport.Contains(extensionFile.ToLower()))
                    return (400, "Ảnh nên có định dạng .png or .jpg");

                var bucketAndPath = await _uow.ApartmentAreaRepo.UploadFileToStorageAsync(request.AreaId, request.Image, _config);
                existingApartment[0].AvatarUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            }

            if (request.CollaborationFile != null)
            {
                int underscoreIndex = request.AreaId.IndexOf('_');
                string collaborationId = request.AreaId.Insert(underscoreIndex, "CF");
                var bucketAndPath = await _uow.ApartmentAreaRepo.UploadFileToStorageAsync(collaborationId, request.CollaborationFile, _config);
                existingApartment[0].FileUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            }

            if (request.LeaderId != existingApartment[0].LeaderId)
            {
                var time = Tools.GetDynamicTimeZone(); ;
                var getCurrent = (await _uow.LeaderHistoryRepo.GetAsync(a => a.AreaId.Equals(request.AreaId) &&
                                                                             a.LeaderId.Equals(existingApartment[0].LeaderId) &&
                                                                             a.To == null)).First();

                getCurrent.To = time;
                await _uow.LeaderHistoryRepo.UpdateAsync(getCurrent);

                var leaderHistoryId = $"LH_{await _uow.LeaderHistoryRepo.Query().CountAsync() + 1:D10}";
                LeaderHistory leaderHistory = new()
                {
                    LeaderHistoryId = leaderHistoryId,
                    AreaId = request.AreaId,
                    LeaderId = request.LeaderId,
                    From = time
                };
                await _uow.LeaderHistoryRepo.AddAsync(leaderHistory);

                //var getLeaderInfo = await _uow.AccountRepo.GetByIdAsync(existingApartment[0].LeaderId);
                //getLeaderInfo!.IsDisabled = true;
                //getLeaderInfo!.DisabledReason = "Đã nghỉ việc hoặc chuyển công tác";
                //await _uow.AccountRepo.UpdateAsync(getLeaderInfo);
            }
            

            existingApartment[0].LeaderId = request.LeaderId;
            existingApartment[0].Name = request.Name;
            existingApartment[0].Description = request.Description;
            existingApartment[0].Address = request.Address;
            existingApartment[0].ManagementCompany = request.ManagementCompany;            
            await _uow.ApartmentAreaRepo.UpdateAsync(existingApartment[0]);

            return (200, $"Chung cư: {request.Name} đã được cập nhật");
        }
    }
}
