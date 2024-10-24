using MediatR;
using Microsoft.Extensions.Configuration;
using Net.payOS;
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
            var paymentLinkInfomation = await _payOS.getPaymentLinkInformation(request.OrderCode);
            return paymentLinkInfomation;
        }
    }
}
