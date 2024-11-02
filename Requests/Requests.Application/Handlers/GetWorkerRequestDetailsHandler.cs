using MediatR;
using Requests.Application.Queries;
using Requests.Domain.Entities;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Requests;
using MimeKit.Cryptography;
using Requests.Application.Mappers;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace Requests.Application.Handlers
{
    internal class GetWorkerRequestDetailsHandler : IRequestHandler<GetWorkerRequestDetailsQuery, ViewModels.WorkerRequestDetail>
    {
        private readonly IUnitOfWork _uow;
        private RequestWorkers _requestWorker;
        private ViewModels.WorkerRequestDetail _workerRequestDetailVM;

        public GetWorkerRequestDetailsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<ViewModels.WorkerRequestDetail> Handle(GetWorkerRequestDetailsQuery request, CancellationToken cancellationToken)
        {
            await FindRequestWorkerByQuery(request);
            if (_requestWorker == null) return (null!);
            await MapRequestToViewModel();
            return _workerRequestDetailVM;
        }

        private async Task FindRequestWorkerByQuery(GetWorkerRequestDetailsQuery request)
        {
            _requestWorker = (await _uow.RequestWorkerRepo.GetAsync(
                rw => rw.WorkerId == request.WorkerId &&
                    rw.RequestId == request.RequestId
            )).FirstOrDefault()!;
        }

        private async Task MapRequestToViewModel()
        {
            Domain.Entities.Requests request = await _uow.RequestRepo.GetByIdAsync(_requestWorker.RequestId);
            Accounts customer = await _uow.AccountRepo.GetByIdAsync(request.CustomerId);
            _workerRequestDetailVM = new ViewModels.WorkerRequestDetail();
            _workerRequestDetailVM.RequestId = request.RequestId;
            _workerRequestDetailVM.CustomerName = customer.FullName;
            _workerRequestDetailVM.CustomerEmail = customer.Email;
            _workerRequestDetailVM.CustomerPhone = customer.PhoneNumber;
            _workerRequestDetailVM.CustomerProblem = request.CustomerProblem;
            _workerRequestDetailVM.RoomId = request.RoomId;
            _workerRequestDetailVM.Workers = await GetWorkersForRepairRequest(request);
            _workerRequestDetailVM.ReplacementProducts = await GetWorkerRequestDetailProducts(request);
        }
        private async Task<List<ViewModels.Worker>> GetWorkersForRepairRequest(Domain.Entities.Requests request)
        {
            List<ViewModels.Worker> workerRequestDetailProducts = new List<ViewModels.Worker>();
            List<Domain.Entities.RequestWorkers> workers = (await _uow.RequestWorkerRepo
                .GetAsync(rw => rw.RequestId == request.RequestId))
                .ToList();
            foreach (var worker in workers)
            {
                ViewModels.Worker workerVM = GetWorkerVM(worker);
                workerRequestDetailProducts.Add(workerVM);  
            }
            return workerRequestDetailProducts;
        }
        private ViewModels.Worker GetWorkerVM(Domain.Entities.RequestWorkers worker)
        {
            return new ViewModels.Worker()
            {
                WorkerId = worker.WorkerId,
                IsLead = worker.IsLead,
            };
        }
        private async Task<List<ViewModels.WorkerRequestDetailProduct>> GetWorkerRequestDetailProducts(Domain.Entities.Requests request)
        {
            List<ViewModels.WorkerRequestDetailProduct> workerRequestDetailProducts = new List<ViewModels.WorkerRequestDetailProduct>();
            List<Domain.Entities.RequestDetails> requestDetails = (await _uow.RequestDetailRepo.GetAsync(rd => rd.RequestId == request.RequestId)).ToList();
            foreach (var requestDetail in requestDetails)
            {
                ViewModels.WorkerRequestDetailProduct workerRequestDetailProduct = await GetWorkerRequestDetailProduct(requestDetail);
            }
            return workerRequestDetailProducts;
        }
        private async Task<ViewModels.WorkerRequestDetailProduct> GetWorkerRequestDetailProduct(Domain.Entities.RequestDetails requestDetail)
        {
            ViewModels.WorkerRequestDetailProduct workerRequestDetailProduct = new ViewModels.WorkerRequestDetailProduct();
            Domain.Entities.Products product = await _uow.ProductRepo.GetByIdAsync(requestDetail.ProductId);
            workerRequestDetailProduct.RequestDetailId = requestDetail.RequestDetailId;

            workerRequestDetailProduct.RequestId = requestDetail.RequestId;

            workerRequestDetailProduct.ProductName = product.Name;

            workerRequestDetailProduct.ProductPrice = await GetLatestProductPrice(product);

            workerRequestDetailProduct.IsCustomerPaying = requestDetail.IsCustomerPaying;

            workerRequestDetailProduct.Description = product.Description;
            return workerRequestDetailProduct;
        }
        private async Task<int> GetLatestProductPrice(Domain.Entities.Products product)
        {
            List<ProductPrices> productPrices = (await _uow.ProductPriceRepo
                .GetAsync(pp => pp.ProductId == product.ProductId)).ToList();
            ProductPrices latestPrice = productPrices
                .OrderByDescending(pp => pp.Date)
                .FirstOrDefault()!;
            return latestPrice.PriceByDate;
        }
    }
}
