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
    internal class GetShippingOrdersOfWorkerHandler : IRequestHandler<GetShippingOrdersOfWorkerQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetShippingOrdersOfWorkerHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetShippingOrdersOfWorkerQuery request, CancellationToken cancellationToken)
        {
            Shipping[] getProccessingShippingOrder;
            if (request.ShippingId == null)
            {
                getProccessingShippingOrder = (await _uow.ShippingRepo.GetAsync(g => (g.WorkerId == request.WorkerId && g.Status == 1) ||
                                                                                     (g.WorkerId == request.WorkerId && g.Status == 2) ||
                                                                                     (g.WorkerId == request.WorkerId && g.Status == 4))).ToArray();
            }
            else
            {
                getProccessingShippingOrder = (await _uow.ShippingRepo.GetAsync(g => g.ShippingId == request.ShippingId)).ToArray();
            }

            var result = new List<object>();
            foreach (var item in getProccessingShippingOrder)
            {
                var getCusInfo = await _uow.AccountRepo.GetByIdAsync(item.CustomerId);
                
                result.Add(new
                {
                    ShippingOrder = item,
                    CusInfo = new
                    {
                        getCusInfo!.AccountId,
                        getCusInfo!.FullName,
                        getCusInfo!.Email,
                        getCusInfo!.PhoneNumber,
                        getCusInfo!.AvatarUrl,
                        getCusInfo!.DateOfBirth
                    }
                });
            }

            return result;
        }
    }
}
