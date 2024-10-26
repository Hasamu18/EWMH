using Constants.Utility;
using Logger.Utility;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Net.payOS;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Sales.Application.Commands;
using Sales.Application.ViewModels;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Unit = QuestPDF.Infrastructure.Unit;

namespace Sales.Application.Handlers
{
    public class SuccessOrderPaymentHandler : IRequestHandler<SuccessOrderPaymentCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        private readonly PayOS _payOS;
        public SuccessOrderPaymentHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
            _payOS = new PayOS(_config["PayOs:ClientId"]!, _config["PayOs:ApiKey"]!, _config["PayOs:CheckSumKey"]!);
        }

        public async Task<(int, string)> Handle(SuccessOrderPaymentCommand request, CancellationToken cancellationToken)
        {            
            var existingCart = (await _uow.OrderRepo.GetAsync(a => a.OrderId.Equals(request.Id1) &&
                                                                   a.Status == false,
                                                              includeProperties: "OrderDetails")).ToList();
            if (existingCart.Count == 0)
                return (200, "Cart is empty");

            List<ProductInvoice> productInvoice = [];
            string transactionDateTime = "";
            var paymentLinkInfomation = await _payOS.getPaymentLinkInformation(request.OrderCode);
            foreach (var item in paymentLinkInfomation.transactions)
            {
                transactionDateTime = item.transactionDateTime;
                Transaction transaction = new ()
                {
                    TransactionId = $"T_{await _uow.TransactionRepo.Query().CountAsync() + 1:D10}",
                    ServiceId = request.Id1,
                    ServiceType = 0,
                    CustomerId = existingCart[0].CustomerId,
                    AccountNumber = item.accountNumber,
                    CounterAccountNumber = item.counterAccountNumber,
                    CounterAccountName = item.counterAccountName,
                    PurchaseTime = DateTime.Parse(item.transactionDateTime),
                    OrderCode = request.OrderCode,
                    Amount = item.amount,
                    Description = item.description
                };
                await _uow.TransactionRepo.AddAsync(transaction);
            }

            for (var i = 0; i < existingCart[0].OrderDetails.Count; i++)
            {
                var productId = existingCart[0].OrderDetails.Select(s => s.ProductId).ElementAt(i);
                var existingProduct = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(productId),
                                                                       includeProperties: "ProductPrices")).ToList();
                var currentProduct = existingProduct[0].ProductPrices.OrderByDescending(p => p.Date).First();
                var quantity = existingCart[0].OrderDetails.Select(s => s.Quantity).ElementAt(i);
                var existingProductInCart = (await _uow.OrderDetailRepo.GetAsync(a => a.OrderId.Equals(existingCart[0].OrderId) &&
                                                                                 a.ProductId.Equals(productId))).ToList();
                existingProductInCart[0].Price = currentProduct.PriceByDate;
                existingProductInCart[0].TotalPrice = currentProduct.PriceByDate * quantity;

                existingProduct[0].InOfStock -= quantity;
                await _uow.ProductRepo.UpdateAsync(existingProduct[0]);

                ProductInvoice items = new()
                {
                    ProductName = existingProduct[0].Name,
                    Quantity = quantity,
                    UnitPrice = currentProduct.PriceByDate,
                    Amount = currentProduct.PriceByDate * quantity
                };
                productInvoice.Add(items);

                await _uow.OrderDetailRepo.UpdateAsync(existingProductInCart[0]);

                for (int z = 0; z < quantity; z++)
                {
                    WarrantyCards warrantyCard = new()
                    {
                        WarrantyCardId = $"WC_{Tools.GenerateRandomString(20)}",
                        OrderId = existingCart[0].OrderId,
                        ProductId = productId,
                        StartDate = DateTime.Parse(transactionDateTime),
                        ExpireDate = DateTime.Parse(transactionDateTime).AddMonths(existingProduct[0].WarantyMonths)
                    };
                    await _uow.WarrantyCardRepo.AddAsync(warrantyCard);
                }         
            }
            var existingRoom = (await _uow.RoomRepo.GetAsync(a => (a.CustomerId ?? "").Equals(existingCart[0].CustomerId))).First();
            var existingApartment = await _uow.ApartmentAreaRepo.GetByIdAsync(existingRoom.AreaId);
            var existingLeader = await _uow.AccountRepo.GetByIdAsync(existingApartment!.LeaderId);
            var existingCustomer = await _uow.AccountRepo.GetByIdAsync(existingCart[0].CustomerId);
            
            QuestPDF.Settings.License = LicenseType.Community;
            var pdf = Document.Create(container =>
            {
                container.Page(p =>
                {
                    p.Size(PageSizes.A4);
                    p.Margin(1, Unit.Centimetre);
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
                                        col.Item().AlignCenter().Text("Hóa Đơn").FontSize(16).Italic().FontColor(Colors.Black);

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
                                        text.Span($"{existingLeader!.PhoneNumber}").SemiBold();
                                    });
                                    col.Item().Text(text =>
                                    {
                                        text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                        text.Span("Email: ");
                                        text.Span($"{existingLeader!.Email}").SemiBold();
                                    });
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
                                        text.Span($"{existingCustomer!.FullName}").SemiBold();
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
                                        text.Span($"{existingCustomer!.PhoneNumber}").SemiBold();
                                    });
                                    col.Item().Text(text =>
                                    {
                                        text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                        text.Span("Email: ");
                                        text.Span($"{existingCustomer!.Email}").SemiBold();
                                    });
                                    col.Item().Text(text =>
                                    {
                                        text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                        text.Span("Chức vụ: ");
                                        text.Span("Khách hàng (Customer)").SemiBold();
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
                                        text.Span("Tên sản phẩm").SemiBold();
                                    });
                                    table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignCenter().AlignMiddle().Text(text =>
                                    {
                                        text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                        text.Span("Số lượng").SemiBold();
                                    });
                                    table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignCenter().AlignMiddle().Text(text =>
                                    {
                                        text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                        text.Span("Giá").SemiBold();
                                    });
                                    table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignCenter().AlignMiddle().Text(text =>
                                    {
                                        text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                        text.Span("Tổng").SemiBold();
                                    });


                                    for (var i = 0; i < productInvoice.Count; i++)
                                    {
                                        var item = productInvoice[i];

                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().Text($"{item.ProductName}").FontSize(12).FontColor(Colors.Black);
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text($"{item.Quantity}").FontSize(12).FontColor(Colors.Black);
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text($"{item.UnitPrice}").FontSize(12).FontColor(Colors.Black);
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text($"{item.Amount}").FontSize(12).FontColor(Colors.Black);
                                    }
                                    ;
                                });

                            contract.Cell().BorderVertical(3).BorderTop(1).BorderBottom(3).Table(
                                table =>
                                {
                                    table.ColumnsDefinition(col =>
                                    {
                                        col.RelativeColumn();
                                        col.ConstantColumn(100);                                 
                                    });
                                    var total = 0;
                                    foreach (var product in productInvoice)
                                    {
                                        total = total + product.Amount;
                                    }
                                    table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text("Tổng cộng:").FontSize(12).FontColor(Colors.Black);
                                    table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text($"{total}").FontSize(12).FontColor(Colors.Black);                                   
                                    ;
                                });
                        });
                });
            }).GeneratePdf();

            var stream = new MemoryStream(pdf);
            IFormFile file = new FormFile(stream, 0, pdf.Length, "EWMH", "Invoice.pdf")
            {
                Headers = new HeaderDictionary(),
                ContentType = "application/pdf"
            };
            var bucketAndPath = await _uow.OrderRepo.UploadFileToStorageAsync(existingCart[0].OrderId, file, _config);
            existingCart[0].PurchaseTime = DateTime.Parse(transactionDateTime);
            existingCart[0].Status = true;
            existingCart[0].FileUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            existingCart[0].OrderCode = request.OrderCode;
            await _uow.OrderRepo.UpdateAsync(existingCart[0]);

            EmailSender emailSender = new(_config);
            string subject = "Invoice";
            string body = $"Here, your invoice";
            await emailSender.SendEmailAsync(existingCustomer!.Email, subject, body, file);

            return (200, "Successful Payment");
        }
    }
}
