using Logger.Utility;
using MediatR;
using Requests.Application.Commands;
using Requests.Domain.Entities;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Handlers
{
    internal class ApproveFeedbackHandler : IRequestHandler<ApproveFeedbackCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;        
        public ApproveFeedbackHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(ApproveFeedbackCommand command, CancellationToken cancellationToken)
        {
            var feedback = await _uow.FeedbackRepo.GetByIdAsync(command.FeedbackId);
            if (feedback == null) return (404, "Phản hồi này không tồn tại.");
            if(feedback.Status==true) return (409, "Phản hồi này đã được duyệt từ trước. Xin vui lòng thử lại với phản hồi khác.");
            feedback.Status = true;
            await _uow.FeedbackRepo.UpdateAsync(feedback);
            return (201, "Đã duyệt phản hồi thành công.");
        }
    }
}
