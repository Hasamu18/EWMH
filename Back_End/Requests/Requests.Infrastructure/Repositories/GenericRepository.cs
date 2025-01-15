using Google.Cloud.Firestore;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Requests.Domain.Entities;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Infrastructure.Repositories
{
    internal class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly FirestoreDb _fireStore;
        private readonly CollectionReference _collection;
        private readonly StorageClient _storage;
        private readonly Sep490Context _context;
        private readonly DbSet<T> _dbSet;
        public GenericRepository(Sep490Context context, FirestoreDb fireStore)
        {
            _fireStore = fireStore;
            _collection = _fireStore.Collection(typeof(T).Name);
            _context = context;
            _storage = StorageClient.Create();
            _dbSet = _context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAsync(
        Expression<Func<T, bool>>? filter = null,
        Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
        string includeProperties = "",
        int? pageIndex = null,
        int? pageSize = null)
        {
            IQueryable<T> query = _dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                query = orderBy(query);
            }

            if (pageIndex.HasValue && pageSize.HasValue)
            {
                query = query.Skip((pageIndex.Value - 1) * pageSize.Value).Take(pageSize.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<T?> GetByIdAsync(string id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task AddAsync(T item)
        {
            await _dbSet.AddAsync(item);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(T item)
        {
            _dbSet.Attach(item);
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(T item)
        {
            _dbSet.Remove(item);
            await _context.SaveChangesAsync();
        }

        public IQueryable<T> Query()
        {
            return _dbSet.AsQueryable();
        }



        public async Task<(string, string)> UploadFileToStorageAsync(string documentId, IFormFile file, IConfiguration config)
        {
            string bucketName = config["bucket_name"]!;
            string path = $"{typeof(T).Name}/{documentId}";//file path in bucket storage
            new FileExtensionContentTypeProvider().TryGetContentType(file.FileName, out string? contentType);
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;
            await _storage.UploadObjectAsync(bucketName, path, contentType, memoryStream);
            return (bucketName, path);
        }

        public async Task DeleteFileToStorageAsync(string documentId, IConfiguration config)
        {
            string bucketName = config["bucket_name"]!;
            string path = $"{typeof(T).Name}/{documentId}";//file path in bucket storage
            await _storage.DeleteObjectAsync(bucketName, path);
        }


    }
}
