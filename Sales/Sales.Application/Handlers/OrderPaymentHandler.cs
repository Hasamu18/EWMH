using MediatR;
using Microsoft.Extensions.Configuration;
using Net.payOS;
using Net.payOS.Types;
using Sales.Application.Commands;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    public class OrderPaymentHandler : IRequestHandler<OrderPaymentCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        private readonly PayOS _payOS;
        public OrderPaymentHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
            _payOS = new PayOS(_config["PayOs:ClientId"]!, _config["PayOs:ApiKey"]!, _config["PayOs:CheckSumKey"]!);
        }

        public async Task<(int, string)> Handle(OrderPaymentCommand request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        //private async Task<string> GetPaymentLinkAsync(
        //    long distance, string studentId, string busId,
        //    string? buyerName = null, string? buyerEmail = null, string? buyerPhone = null)
        //{
        //    var name = $"Payment for {distance} meters";
        //    int price = (int)(10 * distance);
        //    ItemData item = new(name, 1, price);
        //    List<ItemData> items = [item];

        //    var orderCode = ServiceTools.GenerateRandom6DigitNumber();
        //    var amount = price;
        //    var description = $"Payment for {distance} meters";
        //    //var id1 = ServiceTools.EncryptString(studentId);
        //    //var id2 = ServiceTools.EncryptString(busId);

        //    PaymentData paymentData = new(orderCode, amount, description, items,
        //        $"exp+kidgo://Result",
        //        $"exp+kidgo://Result?id1={studentId}&id2={busId}",
        //        buyerName: buyerName, buyerEmail: buyerEmail, buyerPhone: buyerPhone,
        //        expiredAt: (int)(DateTime.UtcNow.AddSeconds(120) - new DateTime(1970, 1, 1)).TotalSeconds, signature: "943b1d9a4fb1028932290fa13c308ac8fbd008c58763ae584bfedc8cbe44f280");

        //    CreatePaymentResult createPayment = await _payOS.createPaymentLink(paymentData);
        //    var linkCheckOut = createPayment.checkoutUrl;
        //    return linkCheckOut;
        //}
    }
}
