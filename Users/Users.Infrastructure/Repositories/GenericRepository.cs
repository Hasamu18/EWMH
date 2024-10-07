using FirebaseAdmin.Auth;
using Google.Cloud.Firestore;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using Users.Domain.IRepositories;
using Users.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Users.Infrastructure.Repositories
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




        //public async Task<UserRecord?> GetAuthenDbAsync(string? uid, string? email, string? phone)
        //{
        //    try
        //    {
        //        UserRecord? userRecord = null;
        //        if (!string.IsNullOrEmpty(uid))
        //            userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(uid);
        //        else if (!string.IsNullOrEmpty(email))
        //            userRecord = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(email);
        //        else if (!string.IsNullOrEmpty(phone))
        //            userRecord = await FirebaseAuth.DefaultInstance.GetUserByPhoneNumberAsync(phone);
        //        return userRecord;
        //    }
        //    catch { return null; }
        //}

        //public async Task<UserRecord> CreateAuthenDbAsync(UserRecordArgs item)
        //{
        //    var user = await FirebaseAuth.DefaultInstance.CreateUserAsync(item);
        //    return user;
        //}

        //public async Task<UserRecord> UpdateAuthenDbAsync(UserRecordArgs item)
        //{
        //    UserRecord user = await FirebaseAuth.DefaultInstance.UpdateUserAsync(item);
        //    return user;
        //}

        //public async Task DeleteAuthenDbAsync(string uid) =>
        //    await FirebaseAuth.DefaultInstance.DeleteUserAsync(uid);

        //public async Task<string> GetEmailVerificationLinkAsync(string email) =>
        //    await FirebaseAuth.DefaultInstance.GenerateEmailVerificationLinkAsync(email);

        //public async Task<string> GetPasswordResetLinkAsync(string email) =>
        //    await FirebaseAuth.DefaultInstance.GeneratePasswordResetLinkAsync(email);


        //public async Task<T?> GetFireStoreAsync(string documentId)
        //{
        //    var document = _collection.Document(documentId);
        //    DocumentSnapshot snapshot = await document.GetSnapshotAsync();
        //    return snapshot.ConvertTo<T>();
        //}

        //public async Task<List<T>> GetFireStoreAsync(Dictionary<string, object> conditions)
        //{
        //    Query query = _collection;

        //    foreach (var condition in conditions)
        //    {
        //        query = query.WhereEqualTo(condition.Key, condition.Value);
        //    }

        //    QuerySnapshot snapshot = await query.GetSnapshotAsync();

        //    List<T> result = [];

        //    foreach (DocumentSnapshot document in snapshot.Documents)
        //    {
        //        if (document.Exists)
        //        {
        //            T item = document.ConvertTo<T>();
        //            result.Add(item);
        //        }
        //    }
        //    return result;
        //}

        //public async Task<T> CreateFireStoreAsync(string documentId, T item)
        //{
        //    var document = _collection.Document(documentId);
        //    await document.CreateAsync(item);
        //    return item;
        //}

        //public async Task<T> UpdateFireStoreAsync(string documentId, T item)
        //{
        //    var document = _collection.Document(documentId);
        //    await document.SetAsync(item, SetOptions.MergeAll);
        //    return item;
        //}

        //public async Task DeleteFireStoreAsync(string documentId) =>
        //    await _collection.Document(documentId).DeleteAsync();

        //public async Task<List<Dictionary<string, object>>> GetPagedListAsync(int pageIndex, int pageSize, bool isAsc, string sortField, string? searchValue, List<string> searchFields, List<string> returnFields)
        //{
        //    Query query = _collection;

        //    // Add sorting
        //    if (!string.IsNullOrEmpty(sortField))
        //    {
        //        query = isAsc ? query.OrderBy(sortField) : query.OrderByDescending(sortField);
        //    }

        //    // Add pagination
        //    int skip = (pageIndex - 1) * pageSize;
        //    query = query.Offset(skip).Limit(pageSize);

        //    // Execute the query
        //    var snapshot = await query.GetSnapshotAsync();

        //    // Filter and map results
        //    var results = new List<Dictionary<string, object>>();
        //    foreach (var document in snapshot.Documents)
        //    {
        //        bool matches = true;

        //        // If searchValue is provided, filter documents
        //        if (!string.IsNullOrEmpty(searchValue) && searchFields != null && searchFields.Count != 0)
        //        {
        //            matches = searchFields.Any(field =>
        //            {
        //                if (document.ContainsField(field))
        //                {
        //                    var value = document.GetValue<string>(field);
        //                    return value != null && value.Contains(searchValue, StringComparison.OrdinalIgnoreCase);
        //                }
        //                return false;
        //            });
        //        }

        //        if (matches)
        //        {
        //            var result = new Dictionary<string, object>();
        //            if (returnFields != null && returnFields.Count != 0)
        //            {
        //                foreach (var field in returnFields)
        //                {
        //                    if (document.ContainsField(field))
        //                    {
        //                        result[field] = document.GetValue<object>(field);
        //                    }
        //                }
        //            }
        //            else
        //            {
        //                // If returnFields is null or empty, return all fields
        //                result = document.ToDictionary();
        //            }
        //            results.Add(result);
        //        }
        //    }

        //    return results;
        //}
    }
}

