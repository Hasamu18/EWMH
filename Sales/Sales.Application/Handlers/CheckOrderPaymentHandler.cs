using Logger.Utility;
using MediatR;
using Microsoft.Extensions.Configuration;
using Net.payOS;
using Net.payOS.Types;
using Sales.Application.Commands;
using Sales.Application.ViewModels;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    public class CheckOrderPaymentHandler : IRequestHandler<CheckOrderPaymentCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        private readonly PayOS _payOS;
        public CheckOrderPaymentHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
            _payOS = new PayOS(_config["PayOs:ClientId"]!, _config["PayOs:ApiKey"]!, _config["PayOs:CheckSumKey"]!);
        }

        public async Task<(int, string)> Handle(CheckOrderPaymentCommand request, CancellationToken cancellationToken)
        {
            var existingCart = (await _uow.OrderRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                                   a.Status == false)).ToList();
            if (existingCart.Count == 0)
                return (200, "Giỏ hàng trống");

            var existingUser = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(request.CustomerId))).ToList();

            var cartDetail = (await _uow.OrderDetailRepo.GetAsync(a => a.OrderId.Equals(existingCart[0].OrderId))).ToList();
            int totalProducts = 0;
            int totalPayment = 0;
            List<ItemData> itemDataList = [];
            foreach (var item in cartDetail)
            {
                var existingProduct = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(item.ProductId),
                                                                       includeProperties: "ProductPrices")).ToList();
                var currentProduct = existingProduct[0].ProductPrices.OrderByDescending(p => p.Date).First();

                string name = existingProduct[0].Name;
                int quantity = item.Quantity;
                int price = currentProduct.PriceByDate;
                itemDataList.Add(new(name, quantity, price));
                totalProducts += quantity;
                totalPayment += price * quantity;
            }            

            var orderCode = long.Parse(Tools.GenerateRandomDigits(10));
            var id1 = existingCart[0].OrderId;
            var amount = totalPayment;
            var description = $"{totalProducts} sản phẩm";
            var buyerName = existingUser[0].FullName;
            var buyerEmail = existingUser[0].Email;
            var buyerPhone = existingUser[0].PhoneNumber;
            var expiredAt = (int)(DateTime.UtcNow.AddMinutes(10) - new DateTime(1970, 1, 1)).TotalSeconds;

            PaymentData paymentData = new(orderCode, amount, description, itemDataList,
                $"{_config["CustomerDeepLink:Url2"]}?isCanceled=1",
                $"{_config["CustomerDeepLink:Url2"]}?id1={id1}&customerNote={request.CustomerNote}",
                buyerName: buyerName, buyerEmail: buyerEmail, 
                buyerPhone: buyerPhone, expiredAt: expiredAt);

            CreatePaymentResult createPayment = await _payOS.createPaymentLink(paymentData);
            var linkCheckOut = createPayment.checkoutUrl;
            return (200, linkCheckOut);
        }
    }
}
