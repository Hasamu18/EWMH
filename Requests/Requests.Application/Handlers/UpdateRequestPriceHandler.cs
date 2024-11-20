using Logger.Utility;
using MediatR;
using Requests.Application.Commands;
using Requests.Domain.Entities;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Handlers
{
    internal class UpdateRequestPriceHandler : IRequestHandler<UpdateRequestPriceCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public UpdateRequestPriceHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(UpdateRequestPriceCommand request, CancellationToken cancellationToken)
        {
            PriceRequests priceRequest = new()
            {
                PriceRequestId = $"PR_{Tools.GenerateRandomString(20)}",
                RequestId = "RQ_0ben9nmrabze546wcegu",
                Date = Tools.GetDynamicTimeZone(),
                PriceByDate = (int)request.Price
            };
            await _uow.PriceRequestRepo.AddAsync(priceRequest);
            return (200, "Đã cập nhật giá yêu cầu");
        }
    }
}
