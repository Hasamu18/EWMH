using FirebaseAdmin.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Domain.IRepositories
{
    public interface IAuthenRepository
    {
        Task<UserRecord?> GetAuthenDbAsync(string? uid = null, string? email = null, string? phone = null);
        Task<UserRecord> CreateAuthenDbAsync(UserRecordArgs item);
        Task<UserRecord> UpdateAuthenDbAsync(UserRecordArgs item);
        Task DeleteAuthenDbAsync(string uid);
        Task<string> GetEmailVerificationLinkAsync(string email);
        Task<string> GetPasswordResetLinkAsync(string email);

    }
}
