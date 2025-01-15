using FirebaseAdmin.Auth;
using Microsoft.Extensions.Configuration;
using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Linq.Expressions;

namespace Users.Domain.IRepositories
{
    public interface IGenericRepository<T>
    {
        Task<IEnumerable<T>> GetAsync(
        Expression<Func<T, bool>>? filter = null,
        Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
        string includeProperties = "",
        int? pageIndex = null,
        int? pageSize = null);

        Task<T?> GetByIdAsync(string id);

        Task AddAsync(T item);

        Task UpdateAsync(T item);

        Task RemoveAsync(T item);

        IQueryable<T> Query();

        Task<(string, string)> UploadFileToStorageAsync(string documentId, IFormFile file, IConfiguration config);
        Task DeleteFileToStorageAsync(string documentId, IConfiguration config);



        //Task<UserRecord?> GetAuthenDbAsync(string? uid = null, string? email = null, string? phone = null);
        //Task<UserRecord> CreateAuthenDbAsync(UserRecordArgs item);
        //Task<UserRecord> UpdateAuthenDbAsync(UserRecordArgs item);
        //Task DeleteAuthenDbAsync(string uid);
        //Task<string> GetEmailVerificationLinkAsync(string email);
        //Task<string> GetPasswordResetLinkAsync(string email);

        //Task<T?> GetFireStoreAsync(string documentId);
        //Task<List<T>> GetFireStoreAsync(Dictionary<string, object> conditions);
        //Task<T> CreateFireStoreAsync(string documentId, T item);
        //Task<T> UpdateFireStoreAsync(string documentId, T item);
        //Task DeleteFireStoreAsync(string documentId);
        //Task<List<Dictionary<string, object>>> GetPagedListAsync(int pageIndex, int pageSize, bool isAsc, string sortField, string? searchValue, List<string> searchFields, List<string> returnFields);
    }
}
