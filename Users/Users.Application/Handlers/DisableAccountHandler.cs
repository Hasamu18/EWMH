using FirebaseAdmin.Auth;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Utility;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class DisableAccountHandler : IRequestHandler<DisableAccountCommand, string>
    {
        private readonly IUnitOfWork _uow;
        private readonly IAuthenRepository _authen;
        public DisableAccountHandler(IUnitOfWork uow, IAuthenRepository authen)
        {
            _uow = uow;
            _authen = authen;
        }

        public async Task<string> Handle(DisableAccountCommand request, CancellationToken cancellationToken)
        {
            var getUserAuthen = await _authen.GetAuthenDbAsync(request.Uid);
            var getUserFireStore = await _uow.AccountRepo.GetFireStoreAsync(request.Uid);
            if (getUserAuthen is null || getUserFireStore is null)
                return "The user does not exist";

            if (getUserFireStore.Role.Equals(Constants.Role.AdminRole))
                return "Admin role can not be disabled";

            UserRecordArgs item = new()
            {
                Uid = request.Uid,
                Disabled = request.Disable
            };
            await _authen.UpdateAuthenDbAsync(item);
           
            getUserFireStore.StatusInText = request.StatusInText;
            await _uow.AccountRepo.UpdateFireStoreAsync(request.Uid, getUserFireStore);

            if (request.Disable)
                return $"{getUserFireStore.DisplayName} has been disabled";
            return $"{getUserFireStore.DisplayName} has been activated";
        }
    }
}
