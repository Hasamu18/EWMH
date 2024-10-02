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

        private IGenericRepository<Leaders> _leaderRepo;
        public IGenericRepository<Leaders> LeaderRepo
        {
            get => _leaderRepo ??= new GenericRepository<Leaders>(_context);
        }

        private IGenericRepository<Workers> _workerRepo;
        public IGenericRepository<Workers> WorkerRepo
        {
            get => _workerRepo ??= new GenericRepository<Workers>(_context);
        }

        private IGenericRepository<Customers> _customerRepo;
        public IGenericRepository<Customers> CustomerRepo
        {
            get => _customerRepo ??= new GenericRepository<Customers>(_context);
        }

        private IGenericRepository<RefreshTokens> _refreshTokenRepo;
        public IGenericRepository<RefreshTokens> RefreshTokenRepo
        {
            get => _refreshTokenRepo ??= new GenericRepository<RefreshTokens>(_context);
        }

        private IGenericRepository<ApartmentAreas> _apartmentAreaRepo;
        public IGenericRepository<ApartmentAreas> ApartmentAreaRepo
        {
            get => _apartmentAreaRepo ??= new GenericRepository<ApartmentAreas>(_context);
        }

        private IGenericRepository<Rooms> _roomRepo;
        public IGenericRepository<Rooms> RoomRepo
        {
            get => _roomRepo ??= new GenericRepository<Rooms>(_context);
        }
    }
}
