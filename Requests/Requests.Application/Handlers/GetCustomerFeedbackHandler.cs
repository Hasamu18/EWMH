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
    internal class GetCustomerFeedbackHandler : IRequestHandler<GetCustomerFeedbackQuery, (int,object)>
    {
        private readonly IUnitOfWork _uow;
        private GetCustomerFeedbackQuery _query;
        private Feedbacks _feedback;
        private ViewModels.CustomerFeedbackDetails _customerFeedbackVM;
        private IMapper _mapper;
        public GetCustomerFeedbackHandler(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<(int,object)> Handle(GetCustomerFeedbackQuery query, CancellationToken cancellationToken)
        {
            _query = query;
            _feedback = await _uow.FeedbackRepo.GetByIdAsync(query.FeedbackId);
            if (_feedback==null) return (404, null!);
            await MapFeedbackToFeedbackViewModel();
            return (200, _customerFeedbackVM);
        }
        private async Task MapFeedbackToFeedbackViewModel()
        {
            var request = await _uow.RequestRepo.GetByIdAsync(_feedback.RequestId);
            var customer = await _uow.AccountRepo.GetByIdAsync(request.CustomerId);
            _customerFeedbackVM = _mapper.Map<ViewModels.CustomerFeedbackDetails>(_feedback);            
            _customerFeedbackVM.CustomerName = customer.FullName;
            _customerFeedbackVM.CustomerEmail = customer.Email;
            _customerFeedbackVM.AvatarUrl = customer.AvatarUrl;
            _customerFeedbackVM.CustomerAddress = await GetCustomerAddress(customer);
            _customerFeedbackVM.CustomerPhone = customer.PhoneNumber;
            _customerFeedbackVM.Time = request.End;
        }
        private async Task<string> GetCustomerAddress(Accounts customer)
        {
            var rooms = (await _uow.RoomRepo.GetAsync(r => r.CustomerId==customer.AccountId)).ToList();
            var room = rooms[0];
            var apartment = await _uow.ApartmentAreaRepo.GetByIdAsync(room.AreaId);
            return apartment.Address;
        }
       
    }
}
