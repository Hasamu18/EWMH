using FirebaseAdmin.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Domain.IRepositories;

namespace Users.Infrastructure.Repositories
{
    public class AuthenRepository : IAuthenRepository
    {
        public async Task<UserRecord?> GetAuthenDbAsync(string? uid, string? email, string? phone)
        {
            try
            {
                UserRecord? userRecord = null;
                if (!string.IsNullOrEmpty(uid))
                    userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(uid);
                else if (!string.IsNullOrEmpty(email))
                    userRecord = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(email);
                else if (!string.IsNullOrEmpty(phone))
                    userRecord = await FirebaseAuth.DefaultInstance.GetUserByPhoneNumberAsync(phone);
                return userRecord;
            }
            catch { return null; }
        }

        public async Task<UserRecord> CreateAuthenDbAsync(UserRecordArgs item)
        {
            var user = await FirebaseAuth.DefaultInstance.CreateUserAsync(item);
            return user;
        }

        public async Task<UserRecord> UpdateAuthenDbAsync(UserRecordArgs item)
        {
            UserRecord user = await FirebaseAuth.DefaultInstance.UpdateUserAsync(item);
            return user;
        }

        public async Task DeleteAuthenDbAsync(string uid) =>
            await FirebaseAuth.DefaultInstance.DeleteUserAsync(uid);

        public async Task<string> GetEmailVerificationLinkAsync(string email) =>
            await FirebaseAuth.DefaultInstance.GenerateEmailVerificationLinkAsync(email);

        public async Task<string> GetPasswordResetLinkAsync(string email) =>
            await FirebaseAuth.DefaultInstance.GeneratePasswordResetLinkAsync(email);

    }
}
