using MediatR;
using Microsoft.Extensions.Configuration;
using Net.payOS;
using Net.payOS.Errors;
using Net.payOS.Types;
using Net.payOS.Utils;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sales.Application.Commands;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    internal class GetPaymentInformationByPayOsHandler : IRequestHandler<GetPaymentInformationByPayOsCommand, object>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        private readonly PayOS _payOS;
        public GetPaymentInformationByPayOsHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
            _payOS = new PayOS(_config["PayOs:ClientId"]!, _config["PayOs:ApiKey"]!, _config["PayOs:CheckSumKey"]!);
        }

        public async Task<object> Handle(GetPaymentInformationByPayOsCommand request, CancellationToken cancellationToken)
        {
            var paymentLinkInfomation = await GetPaymentLinkInformation(request.OrderCode);
            return paymentLinkInfomation;
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
