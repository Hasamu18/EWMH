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
    internal class GetStatisticsHandler : IRequestHandler<GetStatisticsQuery, List<object>>
    {
        private readonly IUnitOfWork _uow;
        public GetStatisticsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<List<object>> Handle(GetStatisticsQuery request, CancellationToken cancellationToken)
        {
            var getTransaction = (await _uow.TransactionRepo.GetAsync(a =>
                                  a.PurchaseTime.Year >= request.StartYear &&
                                  a.PurchaseTime.Year <= request.EndYear)).ToList();

            var orderTransaction = getTransaction.Where(t => t.ServiceType == 0).ToList();
            var spTransaction = getTransaction.Where(t => t.ServiceType == 1).ToList();
            var requestTransaction = getTransaction.Where(t => t.ServiceType == 2).ToList();

            var transactionSummary = new List<object>();

            for (int year = request.StartYear; year <= request.EndYear; year++)
            {
                var orderTotal = orderTransaction.Where(t => t.PurchaseTime.Year == year).Sum(t => t.Amount);
                var serviceTotal = spTransaction.Where(t => t.PurchaseTime.Year == year).Sum(t => t.Amount);
                var requestTotal = requestTransaction.Where(t => t.PurchaseTime.Year == year).Sum(t => t.Amount);

                var yearlyTotal = orderTotal + serviceTotal + requestTotal;

                var orderPercentage = yearlyTotal > 0 ? (int)Math.Round((orderTotal * 100.0 / yearlyTotal)) : 0;
                var servicePercentage = yearlyTotal > 0 ? (int)Math.Round((serviceTotal * 100.0 / yearlyTotal)) : 0;
                var requestPercentage = yearlyTotal > 0 ? (int)Math.Round((requestTotal * 100.0 / yearlyTotal)) : 0;

                transactionSummary.Add(new
                {
                    name = "Đơn hàng",
                    x = year,
                    y = orderTotal,
                    z = orderPercentage
                });
                transactionSummary.Add(new
                {
                    name = "Dịch vụ",
                    x = year,
                    y = serviceTotal,
                    z = servicePercentage
                });
                transactionSummary.Add(new
                {
                    name = "Yêu cầu",
                    x = year,
                    y = requestTotal,
                    z = requestPercentage
                });
            }

            var currentMonth = DateTime.Now.Month;
            var previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;

            var currentMonthOrders = orderTransaction.Where(t => t.PurchaseTime.Month == currentMonth).Count();
            var previousMonthOrders = orderTransaction.Where(t => t.PurchaseTime.Month == previousMonth).Count();
            var currentMonthService = spTransaction.Where(t => t.PurchaseTime.Month == currentMonth).Count();
            var previousMonthService = spTransaction.Where(t => t.PurchaseTime.Month == previousMonth).Count();
            var currentMonthRequests = requestTransaction.Where(t => t.PurchaseTime.Month == currentMonth).Count();
            var previousMonthRequests = requestTransaction.Where(t => t.PurchaseTime.Month == previousMonth).Count();

            var orderChange = previousMonthOrders > 0
                ? (int)Math.Round(((currentMonthOrders - previousMonthOrders) * 100.0 / previousMonthOrders))
                : (currentMonthOrders > 0 ? 100 : 0); // If previous is 0, and current is > 0, it's 100% increase

            var serviceChange = previousMonthService > 0
                ? (int)Math.Round(((currentMonthService - previousMonthService) * 100.0 / previousMonthService))
                : (currentMonthService > 0 ? 100 : 0); // If previous is 0, and current is > 0, it's 100% increase

            var requestChange = previousMonthRequests > 0
                ? (int)Math.Round(((currentMonthRequests - previousMonthRequests) * 100.0 / previousMonthRequests))
                : (currentMonthRequests > 0 ? 100 : 0); // If previous is 0, and current is > 0, it's 100% increase


            var monthlySummary = new List<object>
            {
                new
                {
                    name = "Đơn hàng",
                    currentMonthCount = currentMonthOrders,
                    previousMonthCount = previousMonthOrders,
                    change = orderChange
                },
                new
                {
                    name = "Dịch vụ",
                    currentMonthCount = currentMonthService,
                    previousMonthCount = previousMonthService,
                    change = serviceChange
                },
                new
                {
                    name = "Yêu cầu",
                    currentMonthCount = currentMonthRequests,
                    previousMonthCount = previousMonthRequests,
                    change = requestChange
                }
            };

            return new()
            {
                transactionSummary,
                monthlySummary
            };

        }
    }
}
