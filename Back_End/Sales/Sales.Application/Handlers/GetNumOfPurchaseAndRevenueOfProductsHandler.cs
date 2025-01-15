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
    internal class GetNumOfPurchaseAndRevenueOfProductsHandler : IRequestHandler<GetNumOfPurchaseAndRevenueOfProductsQuery, object>
    {
        private readonly IUnitOfWork _uow;
        public GetNumOfPurchaseAndRevenueOfProductsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetNumOfPurchaseAndRevenueOfProductsQuery request, CancellationToken cancellationToken)
        {
            var result = new List<object>();
            if (request.NumOfTop != null && request.ProductId == null)
            {
                var getPurchasedOrders = (await _uow.OrderRepo.GetAsync(filter: a => a.Status == true,
                                                      includeProperties: "OrderDetails")).ToArray();

                var getDoneRequests = (await _uow.RequestRepo.GetAsync(filter: a => a.Status == 2,
                                                          includeProperties: "RequestDetails")).ToArray();
                
                var purchasedOrdersGroup = getPurchasedOrders.SelectMany(f => f.OrderDetails)
                                                             .GroupBy(g => g.ProductId)
                                                             .Select(group => new
                                                             {
                                                                 ProductId = group.Key,
                                                                 TotalQuantity = group.Sum(d => d.Quantity),
                                                                 TotalPrice = group.Sum(d => d.TotalPrice),
                                                                 OrderIds = group.Select(d => new
                                                                 {
                                                                     d.OrderId,
                                                                     getPurchasedOrders.First(o => o.OrderId == d.OrderId).PurchaseTime
                                                                 }).Distinct().Cast<object>().ToList(),
                                                                 DoneRequestIds = new List<object>()
                                                             })
                                                             .OrderByDescending(o => o.TotalQuantity);
                
                List<(string, int, int, string)> productsList = [];
                foreach (var doneRequest in getDoneRequests)
                {
                    foreach (var attachedOrder in doneRequest.RequestDetails)
                    {
                        var getProductInfo = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(attachedOrder.ProductId),
                                                                   includeProperties: "ProductPrices")).ToList();
                        int currentPriceProduct = getProductInfo[0].ProductPrices
                        .OrderByDescending(p => p.Date)
                        .FirstOrDefault(p => doneRequest.Start >= p.Date)?.PriceByDate
                        ?? getProductInfo[0].ProductPrices.Last().PriceByDate;

                        if (!attachedOrder.IsCustomerPaying)
                            currentPriceProduct = 0;

                        productsList.Add((attachedOrder.ProductId, attachedOrder.Quantity, currentPriceProduct * attachedOrder.Quantity, attachedOrder.RequestId));
                    }                                       
                }

                var doneRequestsGroup = productsList.GroupBy(g => g.Item1)
                                                    .Select(group => new
                                                    {
                                                        ProductId = group.Key,
                                                        TotalQuantity = group.Sum(d => d.Item2),
                                                        TotalPrice = group.Sum(d => d.Item3),
                                                        OrderIds = new List<object>(),
                                                        DoneRequestIds = group.Select(d => new
                                                        {
                                                            RequestId = d.Item4,
                                                            getDoneRequests.First(o => o.RequestId == d.Item4).PurchaseTime
                                                        }).Distinct().Cast<object>().ToList()
                                                    })
                                                    .OrderByDescending(o => o.TotalQuantity);

                var combinedGroup = purchasedOrdersGroup.Union(doneRequestsGroup) 
                                               .GroupBy(g => g.ProductId)
                                               .Select(group => new
                                               {
                                                   ProductId = group.Key,
                                                   TotalQuantity = group.Sum(g => g.TotalQuantity), 
                                                   TotalPrice = group.Sum(g => g.TotalPrice),
                                                   OrderIds = group.SelectMany(g => g.OrderIds).Distinct().OrderByDescending(o =>
                                                   {
                                                       var purchaseTimeProperty = o.GetType().GetProperty("PurchaseTime");
                                                       return purchaseTimeProperty != null ? (DateTime?)purchaseTimeProperty.GetValue(o) : null;
                                                   }).ToList(),
                                                   DoneRequestIds = group.SelectMany(g => g.DoneRequestIds).Distinct().OrderByDescending(d =>
                                                   {
                                                       var purchaseTimeProperty = d.GetType().GetProperty("PurchaseTime");
                                                       return purchaseTimeProperty != null ? (DateTime?)purchaseTimeProperty.GetValue(d) : null;
                                                   }).ToList()
                                               })
                                               .OrderByDescending(o => o.TotalQuantity) 
                                               .Take((int)request.NumOfTop).ToList();

                var productIds = combinedGroup.Select(g => g.ProductId).ToList();
                var productsInfo = (await _uow.ProductRepo.GetAsync(p => productIds.Contains(p.ProductId), includeProperties: "ProductPrices")).ToList();

                result.Add(combinedGroup.Select(group =>
                    {
                        var productInfo = productsInfo.FirstOrDefault(p => p.ProductId == group.ProductId);
                        var latestPrice = productInfo?.ProductPrices.OrderByDescending(d => d.Date).First().PriceByDate;
                        return new
                        {
                            group.ProductId,
                            TotalPurchasedQuantity = group.TotalQuantity,
                            TotalRevenue = group.TotalPrice,
                            ProductName = productInfo?.Name,     
                            ProductDescription = productInfo?.Description, 
                            ProductImageUrl = productInfo?.ImageUrl,  
                            CurrentStock = productInfo?.InOfStock,
                            productInfo?.WarantyMonths,
                            productInfo?.Status,
                            latestPrice,
                            OrderIdList = group.OrderIds,
                            DoneRequestIdList = group.DoneRequestIds
                        };
                    }).ToList());
            }
            else if ((request.NumOfTop != null && request.ProductId != null) ||
                     (request.NumOfTop == null && request.ProductId != null))
            {
                var getPurchasedOrders = (await _uow.OrderRepo.GetAsync(filter: a => a.Status == true,
                                                      includeProperties: "OrderDetails")).ToArray();

                var getDoneRequests = (await _uow.RequestRepo.GetAsync(filter: a => a.Status == 2,
                                                          includeProperties: "RequestDetails")).ToArray();

                var purchasedOrdersGroup = getPurchasedOrders.SelectMany(f => f.OrderDetails)
                                                             .Where(g => g.ProductId.Equals(request.ProductId))
                                                             .GroupBy(g => g.ProductId)
                                                             .Select(group => new
                                                             {
                                                                 ProductId = group.Key,
                                                                 TotalQuantity = group.Sum(d => d.Quantity),
                                                                 TotalPrice = group.Sum(d => d.TotalPrice),
                                                                 OrderIds = group.Select(d => new
                                                                 {
                                                                     d.OrderId,
                                                                     getPurchasedOrders.First(o => o.OrderId == d.OrderId).PurchaseTime
                                                                 }).Distinct().Cast<object>().ToList(),
                                                                 DoneRequestIds = new List<object>()
                                                             });

                List<(string, int, int, string)> productsList = [];
                foreach (var doneRequest in getDoneRequests)
                {
                    foreach (var attachedOrder in doneRequest.RequestDetails)
                    {
                        if (attachedOrder.ProductId.Equals(request.ProductId))
                        {
                            var getProductInfo = (await _uow.ProductRepo.GetAsync(a => a.ProductId.Equals(attachedOrder.ProductId),
                                                                   includeProperties: "ProductPrices")).ToList();
                            int currentPriceProduct = getProductInfo[0].ProductPrices
                            .OrderByDescending(p => p.Date)
                            .FirstOrDefault(p => doneRequest.Start >= p.Date)?.PriceByDate
                            ?? getProductInfo[0].ProductPrices.Last().PriceByDate;

                            if (!attachedOrder.IsCustomerPaying)
                                currentPriceProduct = 0;

                            productsList.Add((attachedOrder.ProductId, attachedOrder.Quantity, currentPriceProduct * attachedOrder.Quantity, attachedOrder.RequestId));
                        }
                    }                        
                }

                var doneRequestsGroup = productsList.Where(g => g.Item1.Equals(request.ProductId))
                                                    .GroupBy(g => g.Item1)
                                                    .Select(group => new
                                                    {
                                                        ProductId = group.Key,
                                                        TotalQuantity = group.Sum(d => d.Item2),
                                                        TotalPrice = group.Sum(d => d.Item3),
                                                        OrderIds = new List<object>(),
                                                        DoneRequestIds = group.Select(d => new
                                                        {
                                                            RequestId = d.Item4,
                                                            getDoneRequests.First(o => o.RequestId == d.Item4).PurchaseTime
                                                        }).Distinct().Cast<object>().ToList()
                                                    });

                var combinedGroup = purchasedOrdersGroup.Union(doneRequestsGroup)
                                               .GroupBy(g => g.ProductId)
                                               .Select(group => new
                                               {
                                                   ProductId = group.Key,
                                                   TotalQuantity = group.Sum(g => g.TotalQuantity),
                                                   TotalPrice = group.Sum(g => g.TotalPrice),
                                                   OrderIds = group.SelectMany(g => g.OrderIds).Distinct().OrderByDescending(o =>
                                                   {
                                                       var purchaseTimeProperty = o.GetType().GetProperty("PurchaseTime");
                                                       return purchaseTimeProperty != null ? (DateTime?)purchaseTimeProperty.GetValue(o) : null;
                                                   }).ToList(),
                                                   DoneRequestIds = group.SelectMany(g => g.DoneRequestIds).Distinct().OrderByDescending(d =>
                                                   {
                                                       var purchaseTimeProperty = d.GetType().GetProperty("PurchaseTime");
                                                       return purchaseTimeProperty != null ? (DateTime?)purchaseTimeProperty.GetValue(d) : null;
                                                   }).ToList()
                                               })
                                               .OrderByDescending(o => o.TotalQuantity).ToList();

                var productIds = combinedGroup.Select(g => g.ProductId).ToList();
                var productsInfo = (await _uow.ProductRepo.GetAsync(p => productIds.Contains(p.ProductId), includeProperties: "ProductPrices")).ToList();

                result.Add(combinedGroup.Select(group =>
                {
                    var productInfo = productsInfo.FirstOrDefault(p => p.ProductId == group.ProductId);
                    var latestPrice = productInfo?.ProductPrices.OrderByDescending(d => d.Date).First().PriceByDate;
                    return new
                    {
                        group.ProductId,
                        TotalPurchasedQuantity = group.TotalQuantity,
                        TotalRevenue = group.TotalPrice,
                        ProductName = productInfo?.Name,
                        ProductDescription = productInfo?.Description,
                        ProductImageUrl = productInfo?.ImageUrl,
                        CurrentStock = productInfo?.InOfStock,
                        productInfo?.WarantyMonths,
                        productInfo?.Status,
                        latestPrice,
                        OrderIdList = group.OrderIds,
                        DoneRequestIdList = group.DoneRequestIds
                    };
                }).ToList());
            }
            else return result;

            return result;
        }
    }
}
