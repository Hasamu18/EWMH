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
using Users.Application.Utility;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

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
                return (409, $"{request.Name} apartment is existing, choose another name");

            var extensionFile = Path.GetExtension(request.Image.FileName);
            string[] extensionSupport = [".png", ".jpg"];
            if (!extensionSupport.Contains(extensionFile.ToLower()))
                return (400, "The avatar should be .png or .jpg");

            var getLeader = (await _uow.LeaderRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId))).FirstOrDefault();
            if (getLeader is null)
                return (404, "Unexisted leader");

            var getLeaderApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId))).FirstOrDefault();
            if (getLeaderApartment != null)
                return (409, $"This leader has assigned to another apartment");

            var areaId = Tools.GenerateIdFormat32();
            var bucketAndPath = await _uow.ApartmentAreaRepo.UploadFileToStorageAsync(areaId, request.Image, _config);
            var apartmentArea = UserMapper.Mapper.Map<ApartmentAreas>(request);
            apartmentArea.AreaId = areaId;
            apartmentArea.AvatarUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            await _uow.ApartmentAreaRepo.AddAsync(apartmentArea);
            
            return (201, $"{request.Name} apartment is added");
        }
    }
}
