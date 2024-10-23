using Logger.Utility;
using MediatR;
using Sales.Application.Queries;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    internal class GetDraftContractHandler : IRequestHandler<GetDraftContractQuery, (int, object)>
    {
        private readonly IUnitOfWork _uow;
        public GetDraftContractHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, object)> Handle(GetDraftContractQuery request, CancellationToken cancellationToken)
        {
            var existingServicePackage = (await _uow.ServicePackageRepo.GetAsync(a => a.ServicePackageId.Equals(request.ServicePackageId),
                                                       includeProperties: "ServicePackagePrices")).ToList();
            if (existingServicePackage.Count == 0)
                return (404, "Service package does not exist");

            var currentServicePackage = existingServicePackage[0].ServicePackagePrices.OrderByDescending(p => p.Date).First();
            var existingCustomer = await _uow.CustomerRepo.GetByIdAsync(request.CustomerId);
            var existingRoom = await _uow.RoomRepo.GetByIdAsync(existingCustomer!.RoomId);
            var existingApartment = await _uow.ApartmentAreaRepo.GetByIdAsync(existingRoom!.AreaId);
            var infoLeader = await _uow.AccountRepo.GetByIdAsync(existingApartment!.LeaderId);
            var infoCustomer = await _uow.AccountRepo.GetByIdAsync(request.CustomerId);            

            string header = @"CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                                Độc lập – Tự do – Hạnh phúc
                                         ——————-
                                HỢP ĐỒNG MUA GÓI DỊCH VỤ";

            string date = $"Thứ: {(int)Tools.GetDynamicTimeZone().DayOfWeek + 1}, Ngày: {Tools.GetDynamicTimeZone().Day}, Tháng: {Tools.GetDynamicTimeZone().Month}, Năm: {Tools.GetDynamicTimeZone().Year}";

            object Side_A = new
            {
                A = "Bên bán: (Bên A)",
                BusinessName = "Tên doanh nghiệp: Electric and Water Minh Huy (EWMH)",
                ApartmentName = $"Tên chung cư: {existingApartment.Name}",
                Address = $"Địa chỉ: {existingApartment.Address}",
                PhoneNumber = $"Điện thoại: {infoLeader!.PhoneNumber}",
                Email = $"Email: {infoLeader!.Email}",
                Role = @"Chức vụ: Trưởng nhóm (Leader)
                -------------------------------------------------------------------------------------------------------"                             
            };

            object Side_B = new
            {
                B = "Bên mua: (Bên B)",
                UserName = $"Tên người mua: {infoCustomer!.FullName}",
                ApartmentName = $"Tên chung cư: {existingApartment.Name}",
                RoomCode = $"Mã phòng: {existingRoom.RoomCode}",
                PhoneNumber = $"Điện thoại: {infoCustomer!.PhoneNumber}",
                Email = $"Email: {infoCustomer!.Email}",
                Role = @"Chức vụ: Khách hàng (Customer)
                Trên cơ sở thỏa thuận, hai bên thống nhất ký kết hợp đồng mua bán dịch vụ với các điều khoản như sau: "
            };

            object clause1 = new
            {
                Title1 = "Điều 1: TÊN DỊCH VỤ – SỐ LƯỢNG – GIÁ TRỊ HỢP ĐỒNG",
                request.ServicePackageId,
                existingServicePackage[0].Name,
                existingServicePackage[0].NumOfRequest,
                currentServicePackage.PriceByDate,
                Quantity = 1,
                TotalPrice = currentServicePackage.PriceByDate,
            };

            object clause2 = new
            {
                Title2 = "Điều 2: CHÍNH SÁCH GÓI DỊCH VỤ",
                Policy = $@"{existingServicePackage[0].Policy}"
            };

            object clause3 = new
            {
                Title3 = "Điều 3: ĐIỀU KHOẢN PHẠT VI PHẠM HỢP ĐỒNG",
                Rule = @" - Hai bên cam kết thực hiện nghiêm túc các điều khoản đã thỏa thuận trên, không được đơn phương thay đổi 
                              hoặc hủy bỏ hợp đồng, bên nào không thực hiện hoặc đơn phương đình chỉ thực hiện hợp đồng mà không có 
                              lý do chính đáng thì sẽ bị phạt tới 100% giá trị của hợp đồng bị vi phạm.

                            - Bên nào vi phạm các điều khoản trên đây sẽ phải chịu trách nhiệm vật chất theo quy định của các văn bản 
                              pháp luật có hiệu lực hiện hành về phạt vi phạm chất lượng, số lượng, thời gian, địa điểm, thanh toán, 
                              bảo hành v.v… mức phạt cụ thể do hai bên thỏa thuận dựa trên khung phạt Nhà nước đã quy định trong các 
                              văn bản pháp luật về loại hợp đồng này."
            };

            object clause4 = new
            {
                Title4 = "Điều 4: ĐIỀU KHOẢN CHUNG",
                GeneralTerms = @" - Hợp đồng này có hiệu lực từ ngày ký và tự động thanh lý hợp đồng kể từ khi Bên B đã nhận đủ hàng 
                                    và Bên A đã nhận đủ tiền.

                                  - Hợp đồng này có giá trị thay thế mọi giao dịch, thỏa thuận trước đây của hai bên. Mọi sự bổ sung, 
                                    sửa đổi hợp đồng này đều phải có sự đồng ý bằng văn bản của hai bên.

                                  - Trừ các trường hợp được quy định ở trên, Hợp đồng này không thể bị hủy bỏ nếu không có thỏa thuận
                                    bằng văn bản của các bên. Trong trường hợp hủy hợp đồng, trách nhiệm liên quan tới phạt vi phạm 
                                    và bồi thường thiệt hại được bảo lưu.

                                  - Hợp đồng này được làm thành 2 bản, có giá trị như nhau. Mỗi bên giữ 1 bản và có giá trị pháp lý 
                                    như nhau."
            };

            object signature_A = new
            {
                A = "ĐẠI DIỆN BÊN A",
                Sign = "(Ký tên và ghi rõ họ tên)"
            };

            object signature_B = new
            {
                B = "ĐẠI DIỆN BÊN B",
                Sign = "(Ký tên và ghi rõ họ tên)"
            };

            return (200, new
            {
                header,
                date,
                Side_A,
                Side_B,
                clause1,
                clause2,
                clause3,
                clause4,
                signature_A,
                signature_B
            });
        }
    }
}
