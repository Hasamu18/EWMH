using MediatR;
using Sales.Application.Queries;
using Sales.Domain.Entities;
using Sales.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Handlers
{
    internal class GetShippingOrderHandler : IRequestHandler<GetShippingOrderQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetShippingOrderHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetShippingOrderQuery request, CancellationToken cancellationToken)
        {
            var getShippingOrder = await _uow.ShippingRepo.GetByIdAsync(request.ShippingId);
            if (getShippingOrder == null)
                return "Đơn hàng vận chuyển không tồn tại";

            Accounts? getWorkerInfo = null;
            if (getShippingOrder.WorkerId != null)
                getWorkerInfo = await _uow.AccountRepo.GetByIdAsync(getShippingOrder.WorkerId);

            return new
            {
                ShippingOrder = getShippingOrder,
                WorkerInfo = getWorkerInfo
            };
        }
    }
}
