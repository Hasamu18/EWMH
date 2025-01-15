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
    internal class AddShippingOrdersToWorkerHandler : IRequestHandler<AddShippingOrdersToWorkerCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public AddShippingOrdersToWorkerHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(AddShippingOrdersToWorkerCommand request, CancellationToken cancellationToken)
        {
            var getWorker = await _uow.AccountRepo.GetByIdAsync(request.WorkerId);
            if (getWorker == null)
                return (404, "Nhân viên không tồn tại");

            foreach (var orderId in request.ShippingIdsList)
            {
                var getShippingOrder = await _uow.ShippingRepo.GetByIdAsync(orderId);

                getShippingOrder!.WorkerId = request.WorkerId;
                getShippingOrder.ShipmentDate = Tools.GetDynamicTimeZone();
                getShippingOrder.Status = 1;
                await _uow.ShippingRepo.UpdateAsync(getShippingOrder);
            }

            return (200, "Đã phân bổ nhân viên vào các đơn hàng này");
        }
    }
}
