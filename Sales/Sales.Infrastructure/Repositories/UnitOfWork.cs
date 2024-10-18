using Google.Cloud.Firestore;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Infrastructure.Repositories
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

        private IGenericRepository<Orders> _orderRepo;
        public IGenericRepository<Orders> OrderRepo
        {
            get => _orderRepo ??= new GenericRepository<Orders>(_context, _fireStore);
        }

        private IGenericRepository<OrderDetails> _orderDetailRepo;
        public IGenericRepository<OrderDetails> OrderDetailRepo
        {
            get => _orderDetailRepo ??= new GenericRepository<OrderDetails>(_context, _fireStore);
        }

        private IGenericRepository<WarrantyCards> _warrantyCardRepo;
        public IGenericRepository<WarrantyCards> WarrantyCardRepo
        {
            get => _warrantyCardRepo ??= new GenericRepository<WarrantyCards>(_context, _fireStore);
        }

        private IGenericRepository<ServicePackages> _servicePackageRepo;
        public IGenericRepository<ServicePackages> ServicePackageRepo
        {
            get => _servicePackageRepo ??= new GenericRepository<ServicePackages>(_context, _fireStore);
        }

        private IGenericRepository<ServicePackagePrices> _servicePackagePriceRepo;
        public IGenericRepository<ServicePackagePrices> ServicePackagePriceRepo
        {
            get => _servicePackagePriceRepo ??= new GenericRepository<ServicePackagePrices>(_context, _fireStore);
        }

        private IGenericRepository<Contracts> _contractRepo;
        public IGenericRepository<Contracts> ContractRepo
        {
            get => _contractRepo ??= new GenericRepository<Contracts>(_context, _fireStore);
        }

        private IGenericRepository<Customers> _customerRepo;
        public IGenericRepository<Customers> CustomerRepo
        {
            get => _customerRepo ??= new GenericRepository<Customers>(_context, _fireStore);
        }
    }
}
