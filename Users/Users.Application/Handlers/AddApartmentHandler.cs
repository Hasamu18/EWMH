using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Mappers;
using Users.Application.Queries;
using Logger.Utility;
using Users.Domain.Entities;
using Users.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace Users.Application.Handlers
{
    public class AddApartmentHandler : IRequestHandler<AddApartmentCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public AddApartmentHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(AddApartmentCommand request, CancellationToken cancellationToken)
        {
            var existingApartment = await _uow.ApartmentAreaRepo.GetAsync(a => a.Name.Equals(request.Name));
            if (existingApartment.Any())
                return (409, $"Chung cư: {request.Name} đang tồn tại, vui lòng chọn một tên khác");

            var extensionFile = Path.GetExtension(request.Image.FileName);
            string[] extensionSupport = [".png", ".jpg"];
            if (!extensionSupport.Contains(extensionFile.ToLower()))
                return (400, "Ảnh nên có định dạng .png or .jpg");

            var getLeader = (await _uow.LeaderRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId))).FirstOrDefault();
            if (getLeader is null)
                return (404, "Trưởng nhóm không tồn tại");

            var getLeaderApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId))).FirstOrDefault();
            if (getLeaderApartment != null)
                return (409, $"Trưởng nhóm đã được gán vào một chung cư khác");

            var areaId = $"AA_{await _uow.ApartmentAreaRepo.Query().CountAsync() + 1:D10}";
            var collaborationId = $"AACF_{await _uow.ApartmentAreaRepo.Query().CountAsync() + 1:D10}";
            var bucketAndPath = await _uow.ApartmentAreaRepo.UploadFileToStorageAsync(areaId, request.Image, _config);
            var bucketAndPath1 = await _uow.ApartmentAreaRepo.UploadFileToStorageAsync(collaborationId, request.Image, _config);
            var apartmentArea = UserMapper.Mapper.Map<ApartmentAreas>(request);
            apartmentArea.AreaId = areaId;
            apartmentArea.AvatarUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            apartmentArea.FileUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath1.Item1}/o/{Uri.EscapeDataString(bucketAndPath1.Item2)}?alt=media";
            await _uow.ApartmentAreaRepo.AddAsync(apartmentArea);

            var leaderHistoryId = $"LH_{await _uow.LeaderHistoryRepo.Query().CountAsync() + 1:D10}";
            LeaderHistory leaderHistory = new()
            {
                LeaderHistoryId = leaderHistoryId,
                AreaId = areaId,
                LeaderId = request.LeaderId,
                From = Tools.GetDynamicTimeZone()
            };
            await _uow.LeaderHistoryRepo.AddAsync(leaderHistory);

            return (201, $"Chung cư: {request.Name} đã được thêm");
        }
    }
}
