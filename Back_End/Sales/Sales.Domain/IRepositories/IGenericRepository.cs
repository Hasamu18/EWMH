using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Domain.IRepositories
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
    }
}
