using Logger.Utility;
using MediatR;
using Microsoft.Extensions.Configuration;
using Net.payOS;
using Net.payOS.Errors;
using Net.payOS.Types;
using Newtonsoft.Json.Linq;
using Requests.Application.Commands;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;
using Requests.Domain.Entities;
using Transaction = Requests.Domain.Entities.Transaction;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using QuestPDF.Infrastructure;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using Unit = QuestPDF.Infrastructure.Unit;
using Requests.Application.ViewModels;
using Newtonsoft.Json;
using Request = Logger.Utility.Constants.Request;
namespace Requests.Application.Handlers
{
    internal class SuccessRequestPaymentHandler : IRequestHandler<SuccessRequestPaymentCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        private readonly PayOS _payOS;
        public SuccessRequestPaymentHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
            _payOS = new PayOS(_config["PayOs:ClientId"]!, _config["PayOs:ApiKey"]!, _config["PayOs:CheckSumKey"]!);
        }

        public async Task<(int, string)> Handle(SuccessRequestPaymentCommand request, CancellationToken cancellationToken)
        {
            var getRequest = await _uow.RequestRepo.GetByIdAsync(request.RequestId);
            if (getRequest == null)
                return (404, "Yêu cầu không tồn tại");

            if (getRequest.Status != (int)Request.Status.Processing)
                return (409, "Chỉ có yêu cầu khi ở trạng thái \"đang xử lý\" mới có thể sử dụng chức năng này");
            
            if (getRequest.CategoryRequest == (int)Request.CategoryRequest.Warranty)
            {
                getRequest.End = Tools.GetDynamicTimeZone();
                getRequest.Conclusion = request.Conclusion;
                getRequest.Status = (int)Request.Status.Done;
                await _uow.RequestRepo.UpdateAsync(getRequest);
            }
            else
            {
                if (request.OrderCode != null)
                {
                    try
                    {
                        var checkOrderCode = await GetPaymentLinkInformation((long)request.OrderCode);
                    }
                    catch 
                    {
                        return (404, "OrderCode không tồn tại");
                    }
                }
                
                int requestPrice = (await _uow.PriceRequestRepo.GetAsync()).OrderByDescending(d => d.Date).First().PriceByDate;
                int attachedOrderPrice = 0;
                var purchaseTime = Tools.GetDynamicTimeZone();
                List<ProductInvoice> productInvoice = [];

                if (getRequest.ContractId != null)
                    requestPrice = 0;

                var getRequestDetail = (await _uow.RequestDetailRepo.GetAsync(a => a.RequestId.Equals(request.RequestId))).ToList();
                if (getRequestDetail.Count != 0)
                {
                    foreach (var product in getRequestDetail)
                    {
                        var getProduct = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(product.ProductId),
                                                                          includeProperties: "ProductPrices")).ToList();
                        int currentProductPrice = 0;
                        if (product.IsCustomerPaying)
                            currentProductPrice = getProduct[0].ProductPrices.OrderByDescending(p => p.Date).First().PriceByDate;

                        attachedOrderPrice += currentProductPrice * product.Quantity;
                        getProduct[0].InOfStock -= product.Quantity;
                        await _uow.ProductRepo.UpdateAsync(getProduct[0]);

                        ProductInvoice items = new()
                        {
                            ProductName = getProduct[0].Name,
                            Quantity = product.Quantity,
                            UnitPrice = currentProductPrice,
                            Amount = currentProductPrice * product.Quantity,
                            Description = product.Description
                        };
                        productInvoice.Add(items);

                        for (int i = 0; i < product.Quantity; i++)
                        {
                            if (getProduct[0].WarantyMonths != 0)
                            {
                                WarrantyCards warrantyCard = new()
                                {
                                    WarrantyCardId = $"WC_{Tools.GenerateRandomString(20)}",
                                    CustomerId = getRequest.CustomerId,
                                    ProductId = product.ProductId,
                                    StartDate = purchaseTime,
                                    ExpireDate = purchaseTime.AddMonths(getProduct[0].WarantyMonths)
                                };
                                await _uow.WarrantyCardRepo.AddAsync(warrantyCard);
                            }
                        }
                    }
                }

                var existingApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.LeaderId.Equals(getRequest.LeaderId))).ToList();
                var existingLeader = await _uow.AccountRepo.GetByIdAsync(getRequest.LeaderId);
                var existingCustomer = await _uow.AccountRepo.GetByIdAsync(getRequest.CustomerId);

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
                                            text.Span($"{existingApartment[0].Name}").SemiBold();
                                        });
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Địa chỉ: ");
                                            text.Span($"{existingApartment[0].Address}").SemiBold();
                                        });
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Điện thoại: ");
                                            text.Span($"{existingLeader!.PhoneNumber}").SemiBold();
                                        });
                                        //col.Item().Text(text =>
                                        //{
                                        //    text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                        //    text.Span("Email: ");
                                        //    text.Span($"{existingLeader!.Email}").SemiBold();
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
                                            text.Span($"{existingCustomer!.FullName}").SemiBold();
                                        });
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Tên chung cư: ");
                                            text.Span($"{existingApartment[0].Name}").SemiBold();
                                        });
                                        col.Item().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Điện thoại: ");
                                            text.Span($"{existingCustomer!.PhoneNumber}").SemiBold();
                                        });
                                        //col.Item().Text(text =>
                                        //{
                                        //    text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                        //    text.Span("Email: ");
                                        //    text.Span($"{existingCustomer!.Email}").SemiBold();
                                        //});
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
                                            col.ConstantColumn(75);
                                            col.ConstantColumn(75);
                                            col.ConstantColumn(75);
                                            col.ConstantColumn(150);
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
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignCenter().AlignMiddle().Text(text =>
                                        {
                                            text.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));
                                            text.Span("Mô tả").SemiBold();
                                        });

                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().Text("Yêu cầu").FontSize(12).FontColor(Colors.Black);
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text("1").FontSize(12).FontColor(Colors.Black);
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text($"{requestPrice}").FontSize(12).FontColor(Colors.Black);
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text($"{requestPrice}").FontSize(12).FontColor(Colors.Black);
                                        table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text("").FontSize(12).FontColor(Colors.Black);
                                        for (var i = 0; i < productInvoice.Count; i++)
                                        {
                                            var item = productInvoice[i];

                                            table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().Text($"{item.ProductName}").FontSize(12).FontColor(Colors.Black);
                                            table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text($"{item.Quantity}").FontSize(12).FontColor(Colors.Black);
                                            table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text($"{item.UnitPrice}").FontSize(12).FontColor(Colors.Black);
                                            table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text($"{item.Amount}").FontSize(12).FontColor(Colors.Black);
                                            table.Cell().Border(1).PaddingHorizontal(4).PaddingVertical(2).AlignMiddle().AlignRight().Text($"{item.Description}").FontSize(12).FontColor(Colors.Black);
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
                var bucketAndPath = await _uow.RequestDetailRepo.UploadFileToStorageAsync(request.RequestId, file, _config);

                var totalPrice = requestPrice + attachedOrderPrice;
                getRequest.Conclusion = request.Conclusion;
                getRequest.Status = (int)Request.Status.Done;
                getRequest.FileUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
                getRequest.OrderCode = request.OrderCode;
                getRequest.TotalPrice = totalPrice;

                if (request.OrderCode != null)
                {
                    var getPaymentLinkInfomation = await GetPaymentLinkInformation((long)request.OrderCode);
                    getRequest.End = DateTime.Parse(getPaymentLinkInfomation.transactions[0].transactionDateTime);
                    getRequest.PurchaseTime = DateTime.Parse(getPaymentLinkInfomation.transactions[0].transactionDateTime);
                    getRequest.IsOnlinePayment = true;

                    Transaction transaction = new()
                    {
                        TransactionId = $"T_{await _uow.TransactionRepo.Query().CountAsync() + 1:D10}",
                        ServiceId = request.RequestId,
                        ServiceType = 2,
                        CustomerId = getRequest.CustomerId,
                        AccountNumber = getPaymentLinkInfomation.transactions[0].accountNumber,
                        CounterAccountNumber = getPaymentLinkInfomation.transactions[0].counterAccountNumber,
                        CounterAccountName = getPaymentLinkInfomation.transactions[0].counterAccountName,
                        PurchaseTime = DateTime.Parse(getPaymentLinkInfomation.transactions[0].transactionDateTime),
                        OrderCode = request.OrderCode,
                        Amount = getPaymentLinkInfomation.amount,
                        Description = getPaymentLinkInfomation.transactions[0].description
                    };
                    await _uow.TransactionRepo.AddAsync(transaction);
                }
                else
                {
                    getRequest.End = purchaseTime;
                    getRequest.PurchaseTime = purchaseTime;
                    getRequest.IsOnlinePayment = false;

                    Transaction transaction = new()
                    {
                        TransactionId = $"T_{await _uow.TransactionRepo.Query().CountAsync() + 1:D10}",
                        ServiceId = request.RequestId,
                        ServiceType = 2,
                        CustomerId = getRequest.CustomerId,
                        AccountNumber = null,
                        CounterAccountNumber = null,
                        CounterAccountName = null,
                        PurchaseTime = purchaseTime,
                        OrderCode = request.OrderCode,
                        Amount = totalPrice,
                        Description = null
                    };
                    await _uow.TransactionRepo.AddAsync(transaction);
                }
                await _uow.RequestRepo.UpdateAsync(getRequest);
            }
            return (200, "Thanh toán thành công");
        }

        //Cách chữa cháy, haizzzzzzzz
        private async Task<PaymentLinkInformation> GetPaymentLinkInformation(long orderId)
        {
            string requestUri = "https://api-merchant.payos.vn/v2/payment-requests/" + orderId;
            JObject jObject = JObject.Parse(await (await new HttpClient().SendAsync(new HttpRequestMessage(HttpMethod.Get, requestUri)
            {
                Headers =
            {
                { "x-client-id", _config["PayOs:ClientId"]! },
                { "x-api-key", _config["PayOs:ApiKey"]! }
            }
            })).Content.ReadAsStringAsync());
            string text = jObject["code"]!.ToString();
            string message = jObject["desc"]!.ToString();
            string text2 = jObject["data"]!.ToString();
            if (text == null)
            {
                throw new PayOSError("20", "Internal Server Error.");
            }

            if (text == "00" && text2 != null)
            {
                //if (SignatureControl.CreateSignatureFromObj(JObject.Parse(text2), _checksumKey) != jObject["signature"].ToString())
                //{
                //    throw new Exception("The data is unreliable because the signature of the response does not match the signature of the data");
                //}

                PaymentLinkInformation? paymentLinkInformation = JsonConvert.DeserializeObject<PaymentLinkInformation>(text2);
                if (paymentLinkInformation == null)
                {
                    throw new InvalidOperationException("Error deserializing JSON response: Deserialized object is null.");
                }

                return paymentLinkInformation;
            }

            throw new PayOSError(text, message);
        }
    }
}
