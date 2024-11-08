using Logger.Utility;
using MediatR;
using Microsoft.Extensions.Configuration;
using Net.payOS;
using Net.payOS.Types;
using Requests.Application.Commands;
using Requests.Application.ViewModels;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Request = Logger.Utility.Constants.Request;

namespace Requests.Application.Handlers
{
    internal class CheckRequestOnlinePaymentHandler : IRequestHandler<CheckRequestOnlinePaymentCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        private readonly PayOS _payOS;
        public CheckRequestOnlinePaymentHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
            _payOS = new PayOS(_config["PayOs:ClientId"]!, _config["PayOs:ApiKey"]!, _config["PayOs:CheckSumKey"]!);
        }

        public async Task<(int, string)> Handle(CheckRequestOnlinePaymentCommand request, CancellationToken cancellationToken)
        {
            var getRequest = await _uow.RequestRepo.GetByIdAsync(request.RequestId);
            if (getRequest == null)
                return (404, "Yêu cầu không tồn tại");

            if (getRequest.CategoryRequest == (int)Request.CategoryRequest.Warranty)
                return (409, "Chỉ có thể thanh toán khi yêu cầu này là \"yêu cầu sửa chữa (Repair Request)\"");

            var isHeadWorker = (await _uow.RequestWorkerRepo.GetAsync(a => a.RequestId.Equals(request.RequestId) &&
                                                                     a.WorkerId.Equals(request.HeadWorkerId))).ToList();
            if (isHeadWorker.Count == 0)
                return (404, "Nhân viên này không có trong yêu cầu này");

            if (!isHeadWorker[0].IsLead)
                return (409, "Chỉ có nhân viên đại diện cho yêu cầu này là có quyền sử dụng chức năng này");

            if (getRequest.Status != (int)Request.Status.Processing)
                return (409, "Chỉ có yêu cầu khi ở trạng thái \"đang xử lý\" mới có thể sử dụng chức năng này");

            int requestPrice = (await _uow.PriceRequestRepo.GetAsync()).OrderByDescending(d => d.Date).First().PriceByDate;
            int attachedOrderPrice = 0;
            List<ItemData> itemDataList = [];

            if (getRequest.CategoryRequest == (int)Request.CategoryRequest.Warranty ||
               (getRequest.CategoryRequest == (int)Request.CategoryRequest.Repair && getRequest.ContractId != null))
                requestPrice = 0;

            itemDataList.Add(new(name: "Yêu cầu", quantity: 1, price: requestPrice));

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
                    
                    string name = getProduct[0].Name;
                    int quantity = product.Quantity;
                    int price = currentProductPrice;
                    itemDataList.Add(new(name, quantity, price));

                    attachedOrderPrice += currentProductPrice * product.Quantity;
                }
            }
            
            int totalPrice = requestPrice + attachedOrderPrice;
            if (totalPrice == 0)
                return (200, "Tổng giá 0 đồng sẽ không có mã QR");

            var orderCode = long.Parse(Tools.GenerateRandomDigits(10));
            var amount = totalPrice;
            var description = $"Thanh toán cho yêu cầu";
            var expiredAt = (int)(DateTime.UtcNow.AddMinutes(10) - new DateTime(1970, 1, 1)).TotalSeconds;

            PaymentData paymentData = new(orderCode, amount, description, itemDataList,
                $"{_config["CustomerDeepLink:Url"]}",
                $"{_config["CustomerDeepLink:Url"]}?requestId={request.RequestId}&conclusion={request.Conclusion}",
                expiredAt: expiredAt);

            CreatePaymentResult createPayment = await _payOS.createPaymentLink(paymentData);
            var linkCheckOut = createPayment.checkoutUrl;
            return (200, linkCheckOut);
        }
    }
}
