using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Domain.Entities;

namespace Users.Domain.IRepositories
{
    public interface IUnitOfWork
    {
        IGenericRepository<Accounts> AccountRepo { get; }
        IGenericRepository<Leaders> LeaderRepo { get; }
        IGenericRepository<Workers> WorkerRepo { get; }
        IGenericRepository<Customers> CustomerRepo { get; }
        IGenericRepository<RefreshTokens> RefreshTokenRepo { get; }
        IGenericRepository<PendingAccounts> PendingAccountRepo { get; }
        IGenericRepository<ApartmentAreas> ApartmentAreaRepo { get; }
        IGenericRepository<Rooms> RoomRepo { get; }
        IGenericRepository<LeaderHistory> LeaderHistoryRepo { get; }
        IGenericRepository<WorkerHistory> WorkerHistoryRepo { get; }
        IGenericRepository<Orders> OrderRepo { get; }
        IGenericRepository<Requests> RequestRepo { get; }
        IGenericRepository<Contracts> ContractRepo { get; }
        IGenericRepository<Shipping> ShippingRepo { get; }
    }
}
