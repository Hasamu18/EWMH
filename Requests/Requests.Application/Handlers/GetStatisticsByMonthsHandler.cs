using Logger.Utility;
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
    internal class GetStatisticsByMonthsHandler : IRequestHandler<GetStatisticsByMonthsQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetStatisticsByMonthsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetStatisticsByMonthsQuery request, CancellationToken cancellationToken)
        {
            var currentTime = Tools.GetDynamicTimeZone();
            var result = new List<object>();
            Queue<DateTime> dateList = [];
            for (int i = 0; i < request.Num; i++)
            {
                DateTime targetDate = currentTime.AddMonths(-i);
                dateList.Enqueue(new DateTime(targetDate.Year, targetDate.Month, 1));
            }

            var getTransaction = (await _uow.TransactionRepo.GetAsync(a => dateList
                                                            .Any(d => d.Year == a.PurchaseTime.Year &&
                                                                      d.Month == a.PurchaseTime.Month)))
                                                            .ToList();

            var orderTransaction = getTransaction.Where(t => t.ServiceType == 0).ToList();
            var spTransaction = getTransaction.Where(t => t.ServiceType == 1).ToList();
            var requestTransaction = getTransaction.Where(t => t.ServiceType == 2).ToList();

            foreach (var yearAndMonth in dateList)
            {
                var orderTotal = orderTransaction.Where(t => t.PurchaseTime.Year == yearAndMonth.Year && t.PurchaseTime.Month == yearAndMonth.Month).Sum(t => t.Amount);
                var serviceTotal = spTransaction.Where(t => t.PurchaseTime.Year == yearAndMonth.Year && t.PurchaseTime.Month == yearAndMonth.Month).Sum(t => t.Amount);
                var requestTotal = requestTransaction.Where(t => t.PurchaseTime.Year == yearAndMonth.Year && t.PurchaseTime.Month == yearAndMonth.Month).Sum(t => t.Amount);
                int totalPrice = orderTotal + serviceTotal + requestTotal;

                result.Add(new
                {
                    CurrentTime = $"{yearAndMonth.Year}-{yearAndMonth.Month}",
                    Result = new
                    {
                        Order = new
                        {
                            name = "Đơn hàng",
                            x = new
                            {
                                yearAndMonth.Year,
                                yearAndMonth.Month
                            },
                            y = orderTotal
                        },
                        ServicePackage = new
                        {
                            name = "Gói dịch vụ",
                            x = new
                            {
                                yearAndMonth.Year,
                                yearAndMonth.Month
                            },
                            y = serviceTotal
                        },
                        Request = new
                        {
                            name = "Yêu cầu",
                            x = new
                            {
                                yearAndMonth.Year,
                                yearAndMonth.Month
                            },
                            y = requestTotal
                        }
                    },
                    TotalRenevue = totalPrice
                });
            }
            return result;
        }
    }
}
