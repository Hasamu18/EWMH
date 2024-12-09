using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
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

            if (request.Image != null)
            {
                var extensionFile = Path.GetExtension(request.Image.FileName);
                string[] extensionSupport = [".png", ".jpg"];
                if (!extensionSupport.Contains(extensionFile.ToLower()))
                    return (400, "Ảnh nên có định dạng .png or .jpg");

                var bucketAndPath = await _uow.ApartmentAreaRepo.UploadFileToStorageAsync(request.AreaId, request.Image, _config);
                existingApartment[0].AvatarUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
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
