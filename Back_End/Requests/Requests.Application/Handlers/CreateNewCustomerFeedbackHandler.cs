using static Logger.Utility.Constants;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Requests.Application.Commands;
using Requests.Application.Mappers;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Logger.Utility;
using Requests.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore.Update.Internal;
using FirebaseAdmin.Messaging;
using AutoMapper;

namespace Requests.Application.Handlers
{
    internal class CreateNewCustomerFeedbackHandler : IRequestHandler<CreateNewCustomerFeedbackCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        private CreateNewCustomerFeedbackCommand _command;
        private Domain.Entities.Requests _request;
        private IMapper _mapper;
        private int REQUEST_COMPLETED = 2;
        public CreateNewCustomerFeedbackHandler(IUnitOfWork uow, IMapper mapper, IConfiguration config)
        {
            _uow = uow;
            _mapper = mapper;
            _config = config;
        }

        public async Task<(int, string)> Handle(CreateNewCustomerFeedbackCommand command, CancellationToken cancellationToken)
        {
            _command = command;
            var validityResult = await IsCommandValid();
            if (!validityResult.IsValid) return (validityResult.ResponseCode, validityResult.Message);
            var feedback = MapFeedbackRequestToFeedbackEntity();
            await _uow.FeedbackRepo.AddAsync(feedback);
            return (201, "Đã tạo phản hồi thành công.");
        }
        private async Task<CommandValidityResult> IsCommandValid()
        {
            _request = await _uow.RequestRepo.GetByIdAsync(_command.Request.RequestId);
            if (_request == null)
                return new CommandValidityResult(404, "Yêu cầu không tồn tại.", false);

            if (_request.CustomerId != _command.CustomerId)
                return new CommandValidityResult(401,
                    "Bạn không được phép phản hồi cho yêu cầu sửa chữa này.", false);

            if (_request.Status != REQUEST_COMPLETED)
                return new CommandValidityResult(409,
                    "Bạn chưa thể phản hồi cho yêu cầu này, do nó chưa được hoàn thành.", false);

            var previousFeedback = (await _uow.FeedbackRepo
                .GetAsync(fb => fb.RequestId == _command.Request.RequestId)).ToList();
            if (previousFeedback.Any())
                return new CommandValidityResult(409,
                    "Bạn đã phản hồi cho yêu cầu này trước đó.", false);


            return new CommandValidityResult(true);
        }
        private Domain.Entities.Feedbacks MapFeedbackRequestToFeedbackEntity()
        {
            var feedback = _mapper.Map<Domain.Entities.Feedbacks>(_command.Request);
            feedback.FeedbackId = $"FB_{Tools.GenerateRandomString(20)}"; ;
            feedback.Status = false;
            return feedback;
        }
        private class CommandValidityResult
        {
            public int ResponseCode { get; }
            public string Message { get; }
            public bool IsValid { get; }
            public CommandValidityResult(bool isValid)
            {
                IsValid = isValid;
            }
            public CommandValidityResult(int responseCode, string message, bool isValid)
            {
                ResponseCode = responseCode;
                Message = message;
                IsValid = isValid;
            }

        }

    }
}
