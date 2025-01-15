using Sales.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Domain.IRepositories
{
    public interface IUnitOfWork
    {
        IGenericRepository<Products> ProductRepo { get; }
        IGenericRepository<ProductPrices> ProductPriceRepo { get; }
        IGenericRepository<Orders> OrderRepo { get; }
        IGenericRepository<OrderDetails> OrderDetailRepo { get; }
        IGenericRepository<WarrantyCards> WarrantyCardRepo { get; }
        IGenericRepository<ServicePackages> ServicePackageRepo { get; }
        IGenericRepository<ServicePackagePrices> ServicePackagePriceRepo { get; }
        IGenericRepository<Contracts> ContractRepo { get; }
        IGenericRepository<Accounts> AccountRepo { get; }
        IGenericRepository<Rooms> RoomRepo { get; }
        IGenericRepository<ApartmentAreas> ApartmentAreaRepo { get; }
        IGenericRepository<Transaction> TransactionRepo { get; }
        IGenericRepository<Requests> RequestRepo { get; }
        IGenericRepository<Shipping> ShippingRepo { get; }
    }
}
