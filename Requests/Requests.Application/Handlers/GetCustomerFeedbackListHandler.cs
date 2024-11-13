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
    internal class GetCustomerFeedbackListHandler : IRequestHandler<GetCustomerFeedbackListQuery, (int, object)>
    {
        private readonly IUnitOfWork _uow;
        private GetCustomerFeedbackListQuery _query;
        private List<Feedbacks> _feedbackList;
        private List<ViewModels.CustomerFeedback> _customerFeedbackVMList;
        private string CUSTOMER_ID_REGEX = @"^C_\d{10}$";
        private string ASCENDING_ORDER = "asc";
        private string DESCENDING_ORDER = "desc";
        private int ALL_FEEDBACK = 2;
        private IMapper _mapper;
        public GetCustomerFeedbackListHandler(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<(int, object)> Handle(GetCustomerFeedbackListQuery query, CancellationToken cancellationToken)
        {
            _query = query;
            _feedbackList = (await _uow.FeedbackRepo.GetAsync()).ToList();
            if (_feedbackList.Count == 0) return (404, null!);
            await GetCustomerFeedbackVMList();
            if (IsCustomer()) FilterEnabledFeedback();
            ApplySearchParams();
            var response = GetResponse();
            return (200, response);
        }
        private async Task GetCustomerFeedbackVMList()
        {

            _customerFeedbackVMList = new List<ViewModels.CustomerFeedback>();
            foreach (var feedback in _feedbackList)
            {
                var customerFeedbackVM = await GetCustomerFeedbackVM(feedback);
                _customerFeedbackVMList.Add(customerFeedbackVM);
            }
        }
        private bool IsCustomer()
        {
            var accountId = _query.AccountId;
            if (Regex.IsMatch(accountId, CUSTOMER_ID_REGEX)) return true;
            return false;
        }
        private void FilterEnabledFeedback()
        {
            _customerFeedbackVMList = _customerFeedbackVMList
                .Where(feedback => feedback.Status == true)
                .ToList();
        }
        private void ApplySearchParams()
        {            
            //Only filter feedback when Status is either 1 (active) or 0 (inactive).
            if(_query.Status != ALL_FEEDBACK)
                _customerFeedbackVMList = _customerFeedbackVMList.Where(fb => fb.Status == Convert.ToBoolean(_query.Status)).ToList();            

            //Order by stars (asc/desc)
            if (_query.SortByStarOrder.Equals(ASCENDING_ORDER))
                _customerFeedbackVMList = _customerFeedbackVMList.OrderBy(fb => fb.Rate).ToList();
            else _customerFeedbackVMList = _customerFeedbackVMList.OrderByDescending(fb => fb.Rate).ToList();

            //Apply pagination
            _customerFeedbackVMList = _customerFeedbackVMList.Skip((_query.PageIndex - 1) * _query.PageSize)
                    .Take(_query.PageSize).ToList();
        }
        private async Task<ViewModels.CustomerFeedback> GetCustomerFeedbackVM(Feedbacks feedback)
        {
            var request = await _uow.RequestRepo.GetByIdAsync(feedback.RequestId);
            var customer = await _uow.AccountRepo.GetByIdAsync(request.CustomerId);
            ViewModels.CustomerFeedback customerFeedback = _mapper.Map<ViewModels.CustomerFeedback>(feedback);
            customerFeedback.RequestId = request.RequestId;
            customerFeedback.CustomerName = customer.FullName;
            customerFeedback.CustomerEmail = customer.Email;
            customerFeedback.AvatarUrl = customer.AvatarUrl;
            return customerFeedback;
        }
        private object GetResponse()
        {
            return new
            {
                results = _customerFeedbackVMList,
                count = _feedbackList.Count,
                averageRate = _feedbackList.Average(feedback => feedback.Rate),
            };
        }
    }
}
