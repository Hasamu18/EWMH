using Constants.Utility;
using Logger.Utility;
using MediatR;
using Microsoft.Extensions.Configuration;
using Sales.Application.Commands;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    internal class ChangeToDeliveredStatusHandler : IRequestHandler<ChangeToDeliveredStatusCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public ChangeToDeliveredStatusHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(ChangeToDeliveredStatusCommand request, CancellationToken cancellationToken)
        {
            var getShippingOrder = await _uow.ShippingRepo.GetByIdAsync(request.ShippingId);
            if (getShippingOrder == null)
                return (404, "Đơn hàng vận chuyển không tồn tại");

            if (getShippingOrder.Status != 2)
                return (409, "Đơn hàng vận chuyển phải ở trạng thái số 2 (Delivering) mới có thể chuyển sang trạng thái 3 (Deliveried)");

            var extensionFile = Path.GetExtension(request.File.FileName);
            string[] extensionSupport = [".png", ".jpg"];
            if (!extensionSupport.Contains(extensionFile.ToLower()))
                return (400, "Ảnh nên có định dạng .png or .jpg");

            var getCusInfo = await _uow.AccountRepo.GetByIdAsync(getShippingOrder.CustomerId);

            var deliveredDate = Tools.GetDynamicTimeZone();
            var bucketAndPath = await _uow.ShippingRepo.UploadFileToStorageAsync(request.ShippingId, request.File, _config);
            getShippingOrder.DeliveriedDate = deliveredDate;
            getShippingOrder.Status = 3;
            getShippingOrder.ProofFileUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            await _uow.ShippingRepo.UpdateAsync(getShippingOrder);

            EmailSender emailSender = new(_config);
            string subject = "Đơn hàng đã giao hàng thành công";
            string body = $"Xin chào {getCusInfo!.FullName},\r\n \r\nĐơn hàng {getShippingOrder.ShippingId} của bạn đã được giao thành công vào {deliveredDate:dd/MM/yyyy-HH:mm:ss}";
            await emailSender.SendEmailAsync(getCusInfo!.Email, subject, body, request.File);

            return (200, "Đã chuyển sang trạng thái \"Đã giao hàng\"");
        }
    }
}
