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
        private readonly FirestoreDb _fireStore;
        private readonly Sep490Context _context;
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public UnitOfWork(Sep490Context context, FirestoreDb fireStore)
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        {
            _fireStore = fireStore;
            _context = context;
        }

        private IGenericRepository<Accounts> _accountRepo;
        public IGenericRepository<Accounts> AccountRepo
        {
            get => _accountRepo ??= new GenericRepository<Accounts>(_context, _fireStore);           
        }

        private IGenericRepository<Leaders> _leaderRepo;
        public IGenericRepository<Leaders> LeaderRepo
        {
            get => _leaderRepo ??= new GenericRepository<Leaders>(_context, _fireStore);
        }

        private IGenericRepository<Workers> _workerRepo;
        public IGenericRepository<Workers> WorkerRepo
        {
            get => _workerRepo ??= new GenericRepository<Workers>(_context, _fireStore);
        }

        private IGenericRepository<Customers> _customerRepo;
        public IGenericRepository<Customers> CustomerRepo
        {
            get => _customerRepo ??= new GenericRepository<Customers>(_context, _fireStore);
        }

        private IGenericRepository<RefreshTokens> _refreshTokenRepo;
        public IGenericRepository<RefreshTokens> RefreshTokenRepo
        {
            get => _refreshTokenRepo ??= new GenericRepository<RefreshTokens>(_context, _fireStore);
        }

        private IGenericRepository<PendingAccounts> _pendingAccountRepo;
        public IGenericRepository<PendingAccounts> PendingAccountRepo
        {
            get => _pendingAccountRepo ??= new GenericRepository<PendingAccounts>(_context, _fireStore);
        }

        private IGenericRepository<ApartmentAreas> _apartmentAreaRepo;
        public IGenericRepository<ApartmentAreas> ApartmentAreaRepo
        {
            get => _apartmentAreaRepo ??= new GenericRepository<ApartmentAreas>(_context, _fireStore);
        }

        private IGenericRepository<Rooms> _roomRepo;
        public IGenericRepository<Rooms> RoomRepo
        {
            get => _roomRepo ??= new GenericRepository<Rooms>(_context, _fireStore);
        }

        private IGenericRepository<LeaderHistory> _leaderHistoryRepo;
        public IGenericRepository<LeaderHistory> LeaderHistoryRepo
        {
            get => _leaderHistoryRepo ??= new GenericRepository<LeaderHistory>(_context, _fireStore);
        }

        private IGenericRepository<WorkerHistory> _workerHistoryRepo;
        public IGenericRepository<WorkerHistory> WorkerHistoryRepo
        {
            get => _workerHistoryRepo ??= new GenericRepository<WorkerHistory>(_context, _fireStore);
        }

        private IGenericRepository<Orders> _orderRepo;
        public IGenericRepository<Orders> OrderRepo
        {
            get => _orderRepo ??= new GenericRepository<Orders>(_context, _fireStore);
        }

        private IGenericRepository<Requests> _requestRepo;
        public IGenericRepository<Requests> RequestRepo
        {
            get => _requestRepo ??= new GenericRepository<Requests>(_context, _fireStore);
        }

        private IGenericRepository<Contracts> _contractRepo;
        public IGenericRepository<Contracts> ContractRepo
        {
            get => _contractRepo ??= new GenericRepository<Contracts>(_context, _fireStore);
        }

        private IGenericRepository<Shipping> _shippingRepo;
        public IGenericRepository<Shipping> ShippingRepo
        {
            get => _shippingRepo ??= new GenericRepository<Shipping>(_context, _fireStore);
        }

        private IGenericRepository<RequestWorkers> _requestWorkerRepo;
        public IGenericRepository<RequestWorkers> RequestWorkerRepo
        {
            get => _requestWorkerRepo ??= new GenericRepository<RequestWorkers>(_context, _fireStore);
        }
    }
}
