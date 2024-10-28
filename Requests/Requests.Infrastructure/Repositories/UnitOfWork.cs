using Google.Cloud.Firestore;
using Requests.Domain.Entities;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Infrastructure.Repositories
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

        private IGenericRepository<Requests.Domain.Entities.Requests> _requestRepo;
        public IGenericRepository<Requests.Domain.Entities.Requests> RequestRepo
        {
            get => _requestRepo ??= new GenericRepository<Requests.Domain.Entities.Requests>(_context, _fireStore);
        }

        private IGenericRepository<RequestWorkers> _requestWorkerRepo;
        public IGenericRepository<RequestWorkers> RequestWorkerRepo
        {
            get => _requestWorkerRepo ??= new GenericRepository<RequestWorkers>(_context, _fireStore);
        }

        private IGenericRepository<PriceRequests> _priceRequestRepo;
        public IGenericRepository<PriceRequests> PriceRequestRepo
        {
            get => _priceRequestRepo ??= new GenericRepository<PriceRequests>(_context, _fireStore);
        }

        private IGenericRepository<RequestDetails> _requestDetailRepo;
        public IGenericRepository<RequestDetails> RequestDetailRepo
        {
            get => _requestDetailRepo ??= new GenericRepository<RequestDetails>(_context, _fireStore);
        }

        private IGenericRepository<Feedbacks> _feedbackRepo;
        public IGenericRepository<Feedbacks> FeedbackRepo
        {
            get => _feedbackRepo ??= new GenericRepository<Feedbacks>(_context, _fireStore);
        }
       
        private IGenericRepository<Contracts> _contractRepo;
        public IGenericRepository<Contracts> ContractRepo
        {
            get => _contractRepo ??= new GenericRepository<Contracts>(_context, _fireStore);
        }

        private IGenericRepository<Accounts> _accountRepo;
        public IGenericRepository<Accounts> AccountRepo
        {
            get => _accountRepo ??= new GenericRepository<Accounts>(_context, _fireStore);
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

        private IGenericRepository<Workers> _workerRepo;
        public IGenericRepository<Workers> WorkerRepo
        {
            get => _workerRepo ??= new GenericRepository<Workers>(_context, _fireStore);
        }

        private IGenericRepository<Products> _productRepo;
        public IGenericRepository<Products> ProductRepo
        {
            get => _productRepo ??= new GenericRepository<Products>(_context, _fireStore);
        }

        private IGenericRepository<ProductPrices> _productPriceRepo;
        public IGenericRepository<ProductPrices> ProductPriceRepo
        {
            get => _productPriceRepo ??= new GenericRepository<ProductPrices>(_context, _fireStore);
        }
    }
}
