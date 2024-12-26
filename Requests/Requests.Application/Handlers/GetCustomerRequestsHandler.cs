using MediatR;
using Requests.Application.Queries;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Handlers
{
    internal class GetCustomerRequestsHandler : IRequestHandler<GetCustomerRequestsQuery, List<object>>
    {
        private readonly IUnitOfWork _uow;
        public GetCustomerRequestsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<List<object>> Handle(GetCustomerRequestsQuery request, CancellationToken cancellationToken)
        {
            List<Requests.Domain.Entities.Requests> requestList = [];
            var result = new List<object>();
            if (request.Status == null && request.StartDate == null)
            {
                requestList = (await _uow.RequestRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId), includeProperties: "Feedbacks")).ToList();
            }
            else if (request.Status == null && request.StartDate != null)
            {
                requestList = (await _uow.RequestRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                               DateOnly.FromDateTime(a.Start) == request.StartDate, includeProperties: "Feedbacks")).ToList();
            }
            else if (request.Status != null && request.StartDate == null)
            {
                requestList = (await _uow.RequestRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                               a.Status == (int)request.Status, includeProperties: "Feedbacks")).ToList();
            }
            else
            {
                requestList = (await _uow.RequestRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) &&
                                                               a.Status == (int)request.Status! &&
                                                               DateOnly.FromDateTime(a.Start) == request.StartDate, includeProperties: "Feedbacks")).ToList();
            }

            foreach (var get in requestList)
            {
                var getCustomer = await _uow.AccountRepo.GetByIdAsync(get.CustomerId);
                result.Add(new
                {
                    get = new
                    {
                        get.RequestId,
                        get.LeaderId,
                        get.CustomerId,
                        get.ContractId,
                        get.RoomId,
                        get.Start,
                        get.End,
                        get.CustomerProblem,
                        get.Conclusion,
                        get.Status,
                        get.CategoryRequest,
                        get.PurchaseTime,
                        get.TotalPrice,
                        get.FileUrl,
                        get.PreRepairEvidenceUrl,
                        get.PostRepairEvidenceUrl,
                        get.OrderCode,
                        get.IsOnlinePayment,
                        Feedback = get.Feedbacks.Select(s => new
                        {
                            s.FeedbackId,
                            s.Content,
                            s.Rate,
                            s.Status
                        })
                    },
                    getCustomer,
                });
            }

            return result;
        }
    }
}
