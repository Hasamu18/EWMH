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
using Microsoft.AspNetCore.Mvc.TagHelpers;
using AutoMapper;

namespace Requests.Application.Handlers
{
    internal class GetCustomerFeedbackListHandler : IRequestHandler<GetCustomerFeedbackListQuery, (int,object)>
    {
        private readonly IUnitOfWork _uow;
        private GetCustomerFeedbackListQuery _query;
        private List<Feedbacks> _feedbackList;
        private List<ViewModels.CustomerFeedback> _customerFeedbackVMList;
        private IMapper _mapper;
        public GetCustomerFeedbackListHandler(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<(int,object)> Handle(GetCustomerFeedbackListQuery query, CancellationToken cancellationToken)
        {
            _query = query;
            _feedbackList = (await _uow.FeedbackRepo.GetAsync()).ToList();
            if (_feedbackList.Count == 0) return (404, null!);
            await GetCustomerFeedbackVMList();
            ApplyPagination();
            var response = GetResponse();
            return (200, response);    
        }
        private async Task GetCustomerFeedbackVMList()
        {
            
            _customerFeedbackVMList = new List<ViewModels.CustomerFeedback>();
            foreach (var feedback in _feedbackList) {
                var customerFeedbackVM = await GetCustomerFeedbackVM(feedback);
                _customerFeedbackVMList.Add(customerFeedbackVM);
            }
        }      
        private void ApplyPagination()
        {
            _customerFeedbackVMList = _customerFeedbackVMList.Skip((_query.PageIndex - 1) * _query.PageSize)
                    .Take(_query.PageSize).ToList();

        }
        private async Task<ViewModels.CustomerFeedback> GetCustomerFeedbackVM(Feedbacks feedback)
        {
            var request = await _uow.RequestRepo.GetByIdAsync(feedback.RequestId);
            var customer = await _uow.AccountRepo.GetByIdAsync(request.CustomerId);
            ViewModels.CustomerFeedback customerFeedback = _mapper.Map<ViewModels.CustomerFeedback>(feedback);
            customerFeedback.CustomerName = customer.FullName;
            customerFeedback.CustomerEmail = customer.Email;
            customerFeedback.AvatarUrl= customer.AvatarUrl;
            return customerFeedback; 
        }
        private object GetResponse()
        {
            return new
            {
                results = _customerFeedbackVMList,
                count = _feedbackList.Count,
                averageRate = _feedbackList.Average(feedback =>feedback.Rate),
            };
        }
    }
}
