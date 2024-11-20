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
using AutoMapper;

namespace Requests.Application.Handlers
{
    internal class GetWorkerRequestDetailsHandler : IRequestHandler<GetWorkerRequestDetailsQuery, ViewModels.WorkerRequestDetail>
    {
        private readonly IUnitOfWork _uow;
        private RequestWorkers _requestWorker;
        private ViewModels.WorkerRequestDetail _workerRequestDetailVM;
        private int WARRANTY_REQUEST = 0;
        private int REPAIR_REQUEST = 1;

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
            _workerRequestDetailVM.ContractId = request.ContractId;
            _workerRequestDetailVM.Status = request.Status;
            _workerRequestDetailVM.CustomerId = customer.AccountId;
            _workerRequestDetailVM.CustomerAvatar = customer.AvatarUrl;
            _workerRequestDetailVM.CustomerName = customer.FullName;
            _workerRequestDetailVM.CustomerEmail = customer.Email;
            _workerRequestDetailVM.CustomerPhone = customer.PhoneNumber;
            _workerRequestDetailVM.CustomerProblem = request.CustomerProblem;
            _workerRequestDetailVM.RoomId = request.RoomId;
            _workerRequestDetailVM.Workers = await GetWorkersForRepairRequest(request);
            if (request.CategoryRequest == WARRANTY_REQUEST)
            {
                _workerRequestDetailVM.WarrantyRequests = await GetWorkerRequestDetailWarrantyRequests(request);
            }

            else _workerRequestDetailVM.ReplacementProducts = await GetWorkerRequestDetailProducts(request);
        }
        private async Task<List<ViewModels.WorkerRequestDetailWorker>> GetWorkersForRepairRequest(Domain.Entities.Requests request)
        {
            List<ViewModels.WorkerRequestDetailWorker> workerRequestDetailProducts = new List<ViewModels.WorkerRequestDetailWorker>();
            List<Domain.Entities.RequestWorkers> workers = (await _uow.RequestWorkerRepo
                .GetAsync(rw => rw.RequestId == request.RequestId))
                .ToList();
            foreach (var worker in workers)
            {
                ViewModels.WorkerRequestDetailWorker workerVM = await GetWorkerVM(worker);
                workerRequestDetailProducts.Add(workerVM);
            }
            return workerRequestDetailProducts;
        }
        private async Task<ViewModels.WorkerRequestDetailWorker> GetWorkerVM(Domain.Entities.RequestWorkers requestWorker)
        {
            Domain.Entities.Accounts worker = await _uow.AccountRepo.GetByIdAsync(requestWorker.WorkerId);
            return new ViewModels.WorkerRequestDetailWorker()
            {
                WorkerId = requestWorker.WorkerId,
                WorkerName = worker.FullName,
                IsLead = requestWorker.IsLead,
                WorkerAvatar = worker.AvatarUrl,
                WorkerPhoneNumber = worker.PhoneNumber,
            };
        }
        private async Task<List<ViewModels.WorkerRequestDetailWarrantyRequest>> GetWorkerRequestDetailWarrantyRequests(Domain.Entities.Requests request)
        {
            List<ViewModels.WorkerRequestDetailWarrantyRequest> workerRequestDetailWarrantyRequests = new List<ViewModels.WorkerRequestDetailWarrantyRequest>();
            List<Domain.Entities.WarrantyRequests> warrantyRequests = (await _uow.WarrantyRequestRepo.GetAsync(wr => wr.RequestId == request.RequestId)).ToList();
            foreach (var warrantyRequest in warrantyRequests)
            {
                ViewModels.WorkerRequestDetailWarrantyRequest workerRequestDetailWarrantyRequest =
                    await GetWorkerRequestDetailWarrantyRequest(warrantyRequest);
                workerRequestDetailWarrantyRequests.Add(workerRequestDetailWarrantyRequest);
            }
            return workerRequestDetailWarrantyRequests;
        }
        private async Task<List<ViewModels.WorkerRequestDetailProduct>> GetWorkerRequestDetailProducts(Domain.Entities.Requests request)
        {
            List<ViewModels.WorkerRequestDetailProduct> workerRequestDetailProducts = new List<ViewModels.WorkerRequestDetailProduct>();
            List<Domain.Entities.RequestDetails> requestDetails = (await _uow.RequestDetailRepo.GetAsync(rd => rd.RequestId == request.RequestId)).ToList();
            foreach (var requestDetail in requestDetails)
            {
                ViewModels.WorkerRequestDetailProduct workerRequestDetailProduct = await GetWorkerRequestDetailProduct(requestDetail);
                workerRequestDetailProducts.Add(workerRequestDetailProduct);
            }
            return workerRequestDetailProducts;
        }
        private async Task<ViewModels.WorkerRequestDetailWarrantyRequest> GetWorkerRequestDetailWarrantyRequest(Domain.Entities.WarrantyRequests warrantyRequest)
        {
            Domain.Entities.WarrantyCards warrantyCard = await _uow.WarrantyCardRepo.GetByIdAsync(warrantyRequest.WarrantyCardId);
            Domain.Entities.Products product = await _uow.ProductRepo.GetByIdAsync(warrantyCard.ProductId);
            ViewModels.WorkerRequestDetailWarrantyRequest workerRequestDetailWarrantyRequest = new ViewModels.WorkerRequestDetailWarrantyRequest()
            {
                WarrantyCardId = warrantyCard.WarrantyCardId,
                StartDate = warrantyCard.StartDate,
                ExpireDate = warrantyCard.ExpireDate,
                ProductId = product.ProductId,
                ProductName = product.Name,
                ProductDescription = product.Description,
                ProductImageUrl = product.ImageUrl,
            };
            return workerRequestDetailWarrantyRequest;

        }
        private async Task<ViewModels.WorkerRequestDetailProduct> GetWorkerRequestDetailProduct(Domain.Entities.RequestDetails requestDetail)
        {
            ViewModels.WorkerRequestDetailProduct workerRequestDetailProduct = new ViewModels.WorkerRequestDetailProduct();
            Domain.Entities.Products product = await _uow.ProductRepo.GetByIdAsync(requestDetail.ProductId);
            workerRequestDetailProduct.RequestDetailId = requestDetail.RequestDetailId;

            workerRequestDetailProduct.RequestId = requestDetail.RequestId;

            workerRequestDetailProduct.ProductName = product.Name;
            workerRequestDetailProduct.ImageUrl = product.ImageUrl;

            workerRequestDetailProduct.ProductPrice = await GetLatestProductPrice(product);

            workerRequestDetailProduct.IsCustomerPaying = requestDetail.IsCustomerPaying;
            workerRequestDetailProduct.Quantity = requestDetail.Quantity;

            workerRequestDetailProduct.ReplacementReason = requestDetail.Description;
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
