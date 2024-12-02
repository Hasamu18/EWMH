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
    internal class ChangeToDelayedStatusHandler : IRequestHandler<ChangeToDelayedStatusCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public ChangeToDelayedStatusHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(ChangeToDelayedStatusCommand request, CancellationToken cancellationToken)
        {
            var getShippingOrder = await _uow.ShippingRepo.GetByIdAsync(request.ShippingId);
            if (getShippingOrder == null)
                return (404, "Đơn hàng vận chuyển không tồn tại");

            if (getShippingOrder.Status != 2)
                return (409, "Đơn hàng vận chuyển phải ở trạng thái số 2 (Delivering) mới có thể chuyển sang trạng thái 4 (Delayed)");

            getShippingOrder.Status = 4;
            await _uow.ShippingRepo.UpdateAsync(getShippingOrder);

            return (200, "Đã chuyển sang trạng thái \"Đã trì hoãn\"");
        }
    }
}
