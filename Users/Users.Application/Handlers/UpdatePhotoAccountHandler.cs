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
    public class UpdatePhotoAccountHandler : IRequestHandler<UpdatePhotoAccountCommand, TResponse<Account>>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public UpdatePhotoAccountHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<TResponse<Account>> Handle(UpdatePhotoAccountCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _uow.AccountRepo.GetFireStoreAsync(request.Uid);
            if (existingUser is null)
                return new TResponse<Account>
                {
                    Message = "The user does not exist",
                    Response = null
                };

            var bucketAndPath = await _uow.AccountRepo.UploadImageToStorageAsync(existingUser.Uid, request.Photo, _config);
            var account = UserMapper.Mapper.Map<Account>(existingUser);
            account.PhotoUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            var userInfo = await _uow.AccountRepo.UpdateFireStoreAsync(account.Uid, account);

            return new TResponse<Account>
            {
                Message = "Update successfully",
                Response = userInfo
            };
        }
    }
}

