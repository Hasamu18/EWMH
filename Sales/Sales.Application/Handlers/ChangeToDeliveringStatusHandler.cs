using Logger.Utility;
using MediatR;
using Sales.Application.Commands;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    internal class ChangeToDeliveringStatusHandler : IRequestHandler<ChangeToDeliveringStatusCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public ChangeToDeliveringStatusHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(ChangeToDeliveringStatusCommand request, CancellationToken cancellationToken)
        {
            var getShippingOrder = await _uow.ShippingRepo.GetByIdAsync(request.ShippingId);
            if (getShippingOrder == null)
                return (404, "Đơn hàng vận chuyển không tồn tại");

            if (getShippingOrder.Status != 1 && getShippingOrder.Status != 4)
                return (409, "Đơn hàng vận chuyển phải ở trạng thái số 1 (Assigned) hoặc 4 (Delayed) mới có thể chuyển sang trạng thái 2 (Delivering)");

            getShippingOrder.ShipmentDate = Tools.GetDynamicTimeZone();
            getShippingOrder.Status = 2;
            await _uow.ShippingRepo.UpdateAsync(getShippingOrder);

            return (200, "Đã chuyển sang trạng thái \"Đang giao hàng\"");
        }
    }
}
