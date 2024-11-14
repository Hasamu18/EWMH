using Constants.Utility;
using Logger.Utility;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Net.payOS;
using Net.payOS.Types;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
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
    internal class CheckServicePackagePaymentHandler : IRequestHandler<CheckServicePackagePaymentCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        private readonly PayOS _payOS;
        public CheckServicePackagePaymentHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
            _payOS = new PayOS(_config["PayOs:ClientId"]!, _config["PayOs:ApiKey"]!, _config["PayOs:CheckSumKey"]!);
        }

        public async Task<(int, string)> Handle(CheckServicePackagePaymentCommand request, CancellationToken cancellationToken)
        {
            var existingServicePackage = (await _uow.ServicePackageRepo.GetAsync(a => a.ServicePackageId.Equals(request.ServicePackageId),
                                                                   includeProperties: "ServicePackagePrices")).ToList();
            if (existingServicePackage.Count == 0)
                return (404, "Service package does not exist");

            var currentServicePackage = existingServicePackage[0].ServicePackagePrices.OrderByDescending(p => p.Date).First();

            var existingRoom = (await _uow.RoomRepo.GetAsync(a => (a.CustomerId ?? "").Equals(request.CustomerId))).First();
            var existingApartment = await _uow.ApartmentAreaRepo.GetByIdAsync(existingRoom.AreaId);
            var infoLeader = await _uow.AccountRepo.GetByIdAsync(existingApartment!.LeaderId);
            var infoCustomer = await _uow.AccountRepo.GetByIdAsync(request.CustomerId);
            
            var contractId = $"CT_{Tools.GetDynamicTimeZone():yyyyMMddHHmmss}_{request.CustomerId}";

            if (request.IsOnlinePayment)
            {
                ItemData itemData = new(
                    name: existingServicePackage[0].Name,
                    quantity: 1,
                    price: currentServicePackage.PriceByDate);
                List<ItemData> itemDataList = [itemData];

                var orderCode = long.Parse(Tools.GenerateRandomDigits(10));
                var servicePackageId = existingServicePackage[0].ServicePackageId;
                var amount = currentServicePackage.PriceByDate;
                var description = $"Thanh toán gói dịch vụ";
                var buyerName = infoCustomer!.FullName;
                var buyerEmail = infoCustomer!.Email;
                var buyerPhone = infoCustomer!.PhoneNumber;
                var expiredAt = (int)(DateTime.UtcNow.AddMinutes(10) - new DateTime(1970, 1, 1)).TotalSeconds;

                PaymentData paymentData = new(orderCode, amount, description, itemDataList,
                    $"{_config["CustomerDeepLink:Url"]}",
                    $"{_config["CustomerDeepLink:Url"]}?servicePackageId={servicePackageId}&contractId={contractId}",
                    buyerName: buyerName, buyerEmail: buyerEmail,
                    buyerPhone: buyerPhone, expiredAt: expiredAt);

                CreatePaymentResult createPayment = await _payOS.createPaymentLink(paymentData);
                var linkCheckOut = createPayment.checkoutUrl;
                return (200, linkCheckOut);
            }
            else
            {
                QuestPDF.Settings.License = LicenseType.Community;
                var pdf = Document.Create(container =>
                {
                    container.Page(p =>
                    {
                        p.Size(PageSizes.A4);
                        p.Margin(1, QuestPDF.Infrastructure.Unit.Centimetre);
                        p.PageColor(Colors.White);
                        p.DefaultTextStyle(x => x.FontSize(20).FontFamily("Arial"));

                        p.Content()
                        .Table(
                            contract =>
                            {
                                contract.ColumnsDefinition(cols =>
                                {
                                    cols.RelativeColumn();
                                });
                                contract.Cell().BorderVertical(3).BorderTop(3).BorderBottom(1).PaddingVertical(1).Column(x =>
                                {
                                    x.Item().Row(header =>
                                    {
                                        header.RelativeItem().Column(col =>
                                        {
                                            col.Item().AlignCenter().Text(@$"CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
 Độc lập – Tự do – Hạnh phúc
          ——————-
 HỢP ĐỒNG MUA GÓI DỊCH VỤ
Mã hợp đồng: {contractId}")
                                            .FontSize(16).Italic().FontColor(Colors.Black).SemiBold();

                                            col.Item().AlignCenter().Text(text =>
                                            {
                                                text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                                text.Span("Thứ:");
                                                text.Span($" {(int)Tools.GetDynamicTimeZone().DayOfWeek + 1}, ").SemiBold();
                                                text.Span("Ngày:");
                                                text.Span($" {Tools.GetDynamicTimeZone().Day}, ").SemiBold();
                                                text.Span("Tháng");
                                                text.Span($" {Tools.GetDynamicTimeZone().Month}, ").SemiBold();
                                                text.Span("Năm:");
                                                text.Span($" {Tools.GetDynamicTimeZone().Year}").SemiBold();
                                            });

                                        });
                                    }
                                    );
                                });

                                contract.Cell().BorderVertical(3).BorderHorizontal(1).PaddingHorizontal(4).Column(
                                    col =>
                                    {
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Bên bán: ");
                                            text.Span("(Bên A)").SemiBold();
                                        });
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Tên doanh nghiệp: ");
                                            text.Span("Electric and Water Minh Huy (EWMH)").SemiBold();
                                        });
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Tên chung cư: ");
                                            text.Span($"{existingApartment.Name}").SemiBold();
                                        });
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Địa chỉ: ");
                                            text.Span($"{existingApartment.Address}").SemiBold();
                                        });
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Điện thoại: ");
                                            text.Span($"{infoLeader!.PhoneNumber}").SemiBold();
                                        });
                                        //col.Item().Text(text =>
                                        //{
                                        //    text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                        //    text.Span("Email: ");
                                        //    text.Span($"{infoLeader!.Email}").SemiBold();
                                        //});
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Chức vụ: ");
                                            text.Span("Trưởng nhóm (Leader)").SemiBold();
                                        });
                                    });
                                contract.Cell().BorderVertical(3).BorderHorizontal(1).PaddingHorizontal(4).Column(
                                    col =>
                                    {
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Bên mua: ");
                                            text.Span("(Bên B)").SemiBold();
                                        });
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Tên người mua: ");
                                            text.Span($"{infoCustomer!.FullName}").SemiBold();
                                        });
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Tên chung cư: ");
                                            text.Span($"{existingApartment.Name}").SemiBold();
                                        });
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Điện thoại: ");
                                            text.Span($"{infoCustomer!.PhoneNumber}").SemiBold();
                                        });
                                        //col.Item().Text(text =>
                                        //{
                                        //    text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                        //    text.Span("Email: ");
                                        //    text.Span($"{infoCustomer!.Email}").SemiBold();
                                        //});
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Chức vụ: ");
                                            text.Span("Khách hàng (Customer)").SemiBold();
                                        });
                                    });
                                contract.Cell().BorderVertical(3).BorderHorizontal(1).PaddingHorizontal(4).Column(
                                    col =>
                                    {
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Trên cơ sở thỏa thuận, hai bên thống nhất ký kết hợp đồng mua bán dịch vụ với các điều khoản như sau: ").SemiBold();
                                        });
                                    });
                                contract.Cell().BorderVertical(3).BorderHorizontal(1).PaddingHorizontal(4).Column(
                                    col =>
                                    {
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Điều 1: TÊN DỊCH VỤ – SỐ LƯỢNG – GIÁ TRỊ HỢP ĐỒNG").SemiBold();
                                        });
                                    });
                                contract.Cell().BorderVertical(3).BorderHorizontal(1).Table(
                                    table =>
                                    {
                                        table.ColumnsDefinition(col =>
                                        {
                                            col.RelativeColumn();
                                            col.ConstantColumn(100);
                                            col.ConstantColumn(100);
                                            col.ConstantColumn(100);
                                        });

                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignCenter().AlignMiddle().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Tên").SemiBold();
                                        });
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignCenter().AlignMiddle().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Số yêu cầu").SemiBold();
                                        });
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignCenter().AlignMiddle().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Giá").SemiBold();
                                        });
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignCenter().AlignMiddle().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Tổng giá").SemiBold();
                                        });

                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().Text($"{existingServicePackage[0].Name}").FontSize(12).FontColor(Colors.Black);
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text($"{existingServicePackage[0].NumOfRequest}").FontSize(12).FontColor(Colors.Black);
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text($"{currentServicePackage.PriceByDate}").FontSize(12).FontColor(Colors.Black);
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text($"{currentServicePackage.PriceByDate}").FontSize(12).FontColor(Colors.Black);
                                    });

                                contract.Cell().BorderVertical(3).BorderHorizontal(1).PaddingHorizontal(4).Column(
                                    col =>
                                    {
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Điều 2: CHÍNH SÁCH GÓI DỊCH VỤ").SemiBold();
                                        });
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span($@"{existingServicePackage[0].Policy}").SemiBold();
                                        });
                                    });
                                contract.Cell().BorderVertical(3).BorderHorizontal(1).PaddingHorizontal(4).Column(
                                    col =>
                                    {
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Điều 3: ĐIỀU KHOẢN PHẠT VI PHẠM HỢP ĐỒNG").SemiBold();
                                        });
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span(@" - Hai bên cam kết thực hiện nghiêm túc các điều khoản đã thỏa thuận trên, không được đơn phương thay đổi hoặc hủy bỏ hợp đồng, bên nào không thực hiện hoặc đơn phương đình chỉ thực hiện hợp đồng mà không có lý do chính đáng thì sẽ bị phạt tới 100% giá trị của hợp đồng bị vi phạm.

 - Bên nào vi phạm các điều khoản trên đây sẽ phải chịu trách nhiệm vật chất theo quy định của các văn bản pháp luật có hiệu lực hiện hành về phạt vi phạm chất lượng, số lượng, thời gian, địa điểm, thanh toán, bảo hành v.v… mức phạt cụ thể do hai bên thỏa thuận dựa trên khung phạt Nhà nước đã quy định trong các văn bản pháp luật về loại hợp đồng này.").SemiBold();
                                        });
                                    });
                                contract.Cell().BorderVertical(3).BorderHorizontal(1).PaddingHorizontal(4).Column(
        col =>
        {
            col.Item().Text(text =>
            {
                text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                text.Span("Điều 4: ĐIỀU KHOẢN CHUNG").SemiBold();
            });
            col.Item().Text(text =>
            {
                text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                text.Span(@" - Hợp đồng này có hiệu lực từ ngày ký và tự động thanh lý hợp đồng kể từ khi Bên B đã nhận đủ hàng và Bên A đã nhận đủ tiền.

 - Hợp đồng này có giá trị thay thế mọi giao dịch, thỏa thuận trước đây của hai bên. Mọi sự bổ sung, sửa đổi hợp đồng này đều phải có sự đồng ý bằng văn bản của hai bên.

 - Trừ các trường hợp được quy định ở trên, Hợp đồng này không thể bị hủy bỏ nếu không có thỏa thuận bằng văn bản của các bên. Trong trường hợp hủy hợp đồng, trách nhiệm liên quan tới phạt vi phạm và bồi thường thiệt hại được bảo lưu.

 - Hợp đồng này được làm thành 2 bản, có giá trị như nhau. Mỗi bên giữ 1 bản và có giá trị pháp lý như nhau.").SemiBold();
            });
        });

                                contract.Cell().BorderVertical(3).BorderHorizontal(1).Table(
                                    table =>
                                    {
                                        table.ColumnsDefinition(col =>
                                        {
                                            col.RelativeColumn();
                                            col.ConstantColumn(260);
                                        });

                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignCenter().AlignMiddle().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("ĐẠI DIỆN BÊN A").SemiBold();
                                        });
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignCenter().AlignMiddle().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("ĐẠI DIỆN BÊN B").SemiBold();
                                        });

                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).PaddingBottom(80).AlignTop().AlignCenter().Text("(Ký tên và ghi rõ họ tên)").FontSize(12).FontColor(Colors.Black);
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).PaddingBottom(80).AlignTop().AlignCenter().Text("(Ký tên và ghi rõ họ tên)").FontSize(12).FontColor(Colors.Black);
                                    });
                            });
                    });
                }).GeneratePdf();

                var stream = new MemoryStream(pdf);
                IFormFile file = new FormFile(stream, 0, pdf.Length, "EWMH", "Contract.pdf")
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "application/pdf"
                };

                var bucketAndPath = await _uow.ContractRepo.UploadFileToStorageAsync(contractId, file, _config);
                var contract = SaleMapper.Mapper.Map<Contracts>(request);
                contract.ContractId = contractId;
                contract.FileUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
                contract.PurchaseTime = Tools.GetDynamicTimeZone();//This time, it is created date
                contract.RemainingNumOfRequests = 0;
                contract.OrderCode = 2;//2 is pending contract
                contract.TotalPrice = null;
                await _uow.ContractRepo.AddAsync(contract);

                return (200, "Sẽ có 1 worker đưa hợp đồng cho bạn ký, bạn sẽ thanh toán sau !!!");
            }            
        }
    }
}
