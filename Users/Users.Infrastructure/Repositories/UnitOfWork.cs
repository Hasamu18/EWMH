using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        //private readonly FirestoreDb _fireStore;
        private readonly Sep490Context _context;
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public UnitOfWork(Sep490Context context  /*, FirestoreDb fireStore*/)
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        {
            //_fireStore = firestore;
            _context = context;
        }

        private IGenericRepository<Accounts> _accountRepo;
        public IGenericRepository<Accounts> AccountRepo
        {
            get => _accountRepo ??= new GenericRepository<Accounts>(_context);           
        }

        private IGenericRepository<RefreshTokens> _refreshTokenRepo;
        public IGenericRepository<RefreshTokens> RefreshTokenRepo
        {
            get => _refreshTokenRepo ??= new GenericRepository<RefreshTokens>(_context);
        }
    }
}
