using Logger.Utility;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Sales.Application.Commands;
using Sales.Application.Mappers;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    public class AddServicePackageHandler : IRequestHandler<AddServicePackageCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public AddServicePackageHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(AddServicePackageCommand request, CancellationToken cancellationToken)
        {
            var extensionFile = Path.GetExtension(request.Image.FileName);
            string[] extensionSupport = [".png", ".jpg"];
            if (!extensionSupport.Contains(extensionFile.ToLower()))
                return (400, "Ảnh nên có định dạng .png or .jpg");

            if (request.NumOfRequest <= 0)
                return (400, "Số lượng yêu cầu phải lớn hơn 0");

            var servicePackageId = $"SP_{(await _uow.ServicePackageRepo.Query().CountAsync() + 1):D10}";
            var bucketAndPath = await _uow.ServicePackageRepo.UploadFileToStorageAsync(servicePackageId, request.Image, _config);
            var servicePackage = SaleMapper.Mapper.Map<ServicePackages>(request);
            servicePackage.ServicePackageId = servicePackageId;
            servicePackage.ImageUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            servicePackage.Policy = @" - Khách hàng có thể đặt lịch sửa điện nước thông qua liên hệ qua với trưởng nhóm quản lý chung cư
 - Cần cung cấp đầy đủ thông tin về số phòng ở chung cư muốn sửa, loại hư hỏng
 - Dịch vụ sẽ phản hồi yêu cầu trong vòng 24 giờ kể từ khi nhận yêu cầu
 - Các thợ đánh giá sơ bộ rồi sẽ báo giá
 - Báo giá sẽ được cung cấp trước khi thực hiện bất kỳ dịch vụ nào
 - Nếu có bất kỳ phát sinh nào trong quá trình sửa chữa, thợ sẽ thông báo ngay cho khách hàng để xác nhận chi phí bổ sung
 - Các dịch vụ sửa chữa khẩn cấp hoặc ngoài giờ hành chính có thể tính phí cao hơn
 - Trong thời gian bảo hành, nếu có sự cố tương tự xảy ra, dịch vụ sẽ sửa chữa lại mà không tính phí
 
- Sửa chữa điện:
 + Thay thế bóng đèn, ổ cắm, công tắc: Thay mới bóng đèn bị hỏng, ổ cắm điện bị cháy, hoặc công tắc bị hư
 + Sửa chữa, thay thế thiết bị điện: Kiểm tra và sửa chữa các thiết bị điện như quạt trần, quạt thông gió, hoặc hệ thống chiếu sáng
 + Sửa chữa hệ thống điện âm tường: Sửa chữa các sự cố về đứt mạch điện, mất điện cục bộ, hoặc sự cố chập điện do quá tải
 + Lắp đặt thiết bị điện: Lắp đặt các thiết bị mới như máy lạnh, quạt hút, hoặc các thiết bị gia dụng khác liên quan đến hệ thống điện
 + Khắc phục sự cố chập cháy điện: Kiểm tra và sửa chữa ngay lập tức khi có dấu hiệu chập cháy điện, đảm bảo an toàn cho căn hộ.
 
 - Sửa chữa nước:
 + Sửa chữa vòi nước, van nước: Sửa chữa hoặc thay thế vòi nước, van nước bị rò rỉ hoặc không hoạt động
 + Sửa chữa bồn cầu, bồn rửa mặt: Khắc phục các sự cố nghẹt, tràn nước ở bồn cầu, bồn rửa mặt, hoặc hệ thống thoát nước
 + Sửa chữa ống dẫn nước: Sửa chữa các sự cố rò rỉ, vỡ ống dẫn nước, đặc biệt là hệ thống ống âm tường hoặc ống dẫn nước nóng
 + Sửa chữa máy bơm nước: Kiểm tra và sửa chữa máy bơm nước trong trường hợp căn hộ không có nước hoặc áp lực nước yếu
 + Khắc phục tắc nghẽn hệ thống thoát nước: Xử lý các vấn đề nghẽn cống thoát nước tại nhà tắm, bếp hoặc ban công";
            servicePackage.Status = false;
            await _uow.ServicePackageRepo.AddAsync(servicePackage);

            ServicePackagePrices servicePackagePrice = new()
            {
                ServicePackagePriceId = $"SPP_{Tools.GenerateRandomString(20)}",
                ServicePackageId = servicePackageId,
                Date = Tools.GetDynamicTimeZone(),
                PriceByDate = request.Price
            };
            await _uow.ServicePackagePriceRepo.AddAsync(servicePackagePrice);

            return (201, $"Gói dịch vụ: {request.Name} đã được thêm");
        }
    }
}
