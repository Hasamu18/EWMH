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
using Requests.Application.ViewModels;
using MimeKit.Cryptography;
using Requests.Application.Mappers;

namespace Requests.Application.Handlers
{
    internal class GetWorkerRequestsHandler : IRequestHandler<GetWorkerRequestsQuery, List<object>>
    {
        private readonly IUnitOfWork _uow;
        private List<RequestWorkers> _requestWorkers;
        private List<Domain.Entities.Requests> _requests;
        private List<ViewModels.Request> _requestsVM;
        private int WARRANTY_REQUEST = 0;
        private int REPAIR_REQUEST = 1;        
        public GetWorkerRequestsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<List<object>> Handle(GetWorkerRequestsQuery request, CancellationToken cancellationToken)
        {
            ResetSearch();
            _requestWorkers = (await _uow.RequestWorkerRepo.GetAsync(rw => rw.WorkerId == request.WorkerId)).ToList();
            if (!_requestWorkers.Any()) return (null!);
            if (request.IsWarranty) await FindWarrantyRequests();
            else await FindRepairRequests();
            if (!_requests.Any()) return (null!);
            MapRequestsToViewModels();            
            return _requestsVM.Cast<object>().ToList();
        }
        private void ResetSearch()
        {
            _requestWorkers = new List<RequestWorkers>();
            _requests = new List<Domain.Entities.Requests>();
            _requestsVM = new List<ViewModels.Request>();
        }
        
        private async Task FindWarrantyRequests()
        {
            foreach (var requestWorker in _requestWorkers)
            {
                Domain.Entities.Requests request = await _uow.RequestRepo.GetByIdAsync(requestWorker.RequestId);
                if (request.CategoryRequest == WARRANTY_REQUEST) _requests.Add(request);
            }
        }
        private async Task FindRepairRequests()
        {
            foreach (var requestWorker in _requestWorkers)
            {
                Domain.Entities.Requests request = await _uow.RequestRepo.GetByIdAsync(requestWorker.RequestId);
                if (request.CategoryRequest == REPAIR_REQUEST) _requests.Add(request);
            }
        }
        private void MapRequestsToViewModels()
        {
            foreach(var request in _requests)
            {
                var requestVM = RequestToViewModel(request);   
                _requestsVM.Add(requestVM);
            }
        }
        private ViewModels.Request RequestToViewModel(Domain.Entities.Requests request)
        {
            ViewModels.Request requestVM = RequestMapper.Mapper.Map<ViewModels.Request>(request);            
            return requestVM;
        }
    }
}
