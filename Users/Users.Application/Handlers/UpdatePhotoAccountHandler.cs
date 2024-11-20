using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
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
    public class UpdatePhotoAccountHandler : IRequestHandler<UpdatePhotoAccountCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public UpdatePhotoAccountHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(UpdatePhotoAccountCommand request, CancellationToken cancellationToken)
        {
            var existingUser = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(request.AccountId))).ToList();
            if (!existingUser.Any())
                return (404, "Người dùng không tồn tại");

            var extensionFile = Path.GetExtension(request.Image.FileName);
            string[] extensionSupport = { ".png", ".jpg" };
            if (!extensionSupport.Contains(extensionFile.ToLower()))
                return (400, "Ảnh nên có định dạng .png or .jpg");

            var bucketAndPath = await _uow.AccountRepo.UploadFileToStorageAsync(request.AccountId, request.Image, _config);
            existingUser[0].AvatarUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            await _uow.AccountRepo.UpdateAsync(existingUser[0]);

            return (200, "Ảnh đã được cập nhật thành công");
        }
    }
}

