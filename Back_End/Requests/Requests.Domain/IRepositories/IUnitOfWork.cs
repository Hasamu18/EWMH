using Requests.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Domain.IRepositories
{
    public interface IUnitOfWork
    {
        IGenericRepository<Requests.Domain.Entities.Requests> RequestRepo { get; }
        IGenericRepository<RequestWorkers> RequestWorkerRepo { get; }
        IGenericRepository<PriceRequests> PriceRequestRepo { get; }
        IGenericRepository<RequestDetails> RequestDetailRepo { get; }
        IGenericRepository<Feedbacks> FeedbackRepo { get; }
        IGenericRepository<Contracts> ContractRepo { get; }
        IGenericRepository<Accounts> AccountRepo { get; }
        IGenericRepository<ApartmentAreas> ApartmentAreaRepo { get; }
        IGenericRepository<Rooms> RoomRepo { get; }
        IGenericRepository<Workers> WorkerRepo { get; }
        IGenericRepository<Products> ProductRepo { get; }
        IGenericRepository<ProductPrices> ProductPriceRepo { get; }
        IGenericRepository<WarrantyCards> WarrantyCardRepo { get; }
        IGenericRepository<WarrantyRequests> WarrantyRequestRepo { get; }
        IGenericRepository<Transaction> TransactionRepo { get; }
        IGenericRepository<Shipping> ShippingRepo { get; }
    }
}
