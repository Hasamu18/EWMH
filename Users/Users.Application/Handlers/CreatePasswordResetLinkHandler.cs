using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Logger.Utility;
using Users.Domain.IRepositories;
using Constants.Utility;

namespace Users.Application.Handlers
{
    public class CreatePasswordResetLinkHandler : IRequestHandler<CreatePasswordResetLinkCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public CreatePasswordResetLinkHandler(IConfiguration config, IUnitOfWork uow)
        {
            _config = config;
            _uow = uow;
        }
        public async Task<(int, string)> Handle(CreatePasswordResetLinkCommand request, CancellationToken cancellationToken)
        {
            var existingEmail = await _uow.AccountRepo.GetAsync(a => a.Email.Equals(request.Email));
            if (!existingEmail.Any())
                return (404, $"Email: {request.Email} chưa được đăng ký trong ứng dụng của chúng tôi");

            EmailSender emailSender = new(_config);
            var link = $"https://loloca.id.vn/change-password?token={Tools.EncryptString(request.Email)}";
            string subject = "Thiết lập lại mật khẩu";
            string body = $"<p>Nhấp vào đây để đổi mật khẩu:</p>" +
            $"<a href=\"{link}\" style=\"padding: 10px; color: white; background-color: #007BFF; text-decoration: none;\">" +
            $"Thiết lập lại mật khẩu</a>";
            await emailSender.SendEmailAsync(request.Email, subject, body);

            return (200, $"Đường liên kết đổi mật khẩu đã được gửi đến email: {request.Email}");
        }
    }
}
