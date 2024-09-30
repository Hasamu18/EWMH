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
using Users.Application.Utility;
using Users.Domain.Entities;

namespace Users.Infrastructure.Repositories
{
    internal class GenericRepository<T> : IGenericRepository<T>
    {
        //private readonly FirestoreDb _fireStore;
        //private readonly CollectionReference _collection;
        private readonly StorageClient _storage;
        private readonly Sep490Context _context;
        public GenericRepository(Sep490Context context/*FirestoreDb fireStore*/)
        {
            //_fireStore = fireStore;
            //_collection = _fireStore.Collection(typeof(T).Name);
            _context = context;
            _storage = StorageClient.Create();
        }

        public async Task<(string, string)> UploadFileToStorageAsync(string documentId, IFormFile file, IConfiguration config)
        {
            string bucketName = config["bucket_name"]!;
            string path = $"{typeof(T).Name}/{documentId}";//file path in bucket storage
            new FileExtensionContentTypeProvider().TryGetContentType(file.FileName, out string contentType);
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

