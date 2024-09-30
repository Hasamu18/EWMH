using FirebaseAdmin.Auth;
using Microsoft.Extensions.Configuration;
using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Users.Domain.IRepositories
{
    public interface IGenericRepository<T>
    {
        Task<(string, string)> UploadFileToStorageAsync(string documentId, IFormFile file, IConfiguration config);
        Task DeleteFileToStorageAsync(string documentId, IConfiguration config);




        //Task<T?> GetFireStoreAsync(string documentId);
        //Task<List<T>> GetFireStoreAsync(Dictionary<string, object> conditions);
        //Task<T> CreateFireStoreAsync(string documentId, T item);
        //Task<T> UpdateFireStoreAsync(string documentId, T item);
        //Task DeleteFireStoreAsync(string documentId);
        //Task<List<Dictionary<string, object>>> GetPagedListAsync(int pageIndex, int pageSize, bool isAsc, string sortField, string? searchValue, List<string> searchFields, List<string> returnFields);
    }
}
