﻿using MediatR;
using Requests.Application.Queries;
using Requests.Domain.Entities;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Requests;
using Requests.Application.ViewModels;
using MimeKit.Cryptography;
using Requests.Application.Mappers;
using Microsoft.AspNetCore.Mvc.TagHelpers;

namespace Requests.Application.Handlers
{
    internal class GetWarrantyCardsHandler : IRequestHandler<GetWarrantyCardsQuery, object>
    {
        private readonly IUnitOfWork _uow;        
        private List<WarrantyCards> _warrantyCards;
        private List<ViewModels.WarrantyCard> _warrantyCardsVM;
        private GetWarrantyCardsQuery _query;
        public GetWarrantyCardsHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<object> Handle(GetWarrantyCardsQuery query, CancellationToken cancellationToken)
        {
            _query = query;
            await FindWarrantyCardsByCustomer();
            await MapWarrantyCardsVMFromWarrantyCards();            
            await RemoveTakenWarrantyCards();
            ApplySearchParams();
            return new
            {
                results = _warrantyCardsVM,
                count = _warrantyCards.Count,
            };
        }
        private async Task FindWarrantyCardsByCustomer()
        {
            _warrantyCards = (await _uow.WarrantyCardRepo.GetAsync(wc => wc.CustomerId == _query.CustomerId)).ToList();
        }
        private async Task MapWarrantyCardsVMFromWarrantyCards()
        {
            _warrantyCardsVM = new List<ViewModels.WarrantyCard>();
            foreach (var warrantyCard in _warrantyCards)
            {
                string productId = warrantyCard.ProductId;
                var warrantyCardVM = await GetWarrantyCardVM(warrantyCard);
                _warrantyCardsVM.Add(warrantyCardVM);
            }
        }
       
        //In this function, Warranty Cards added to WarrantyRequests table are removed.
        private async Task RemoveTakenWarrantyCards() 
        {
            var warrantyRequests = (await _uow.WarrantyRequestRepo.GetAsync(wr => wr.RequestId==_query.RequestId)).ToList();
            var warrantyRequestIds = new HashSet<string>(warrantyRequests.Select(wr => wr.WarrantyCardId));
            _warrantyCardsVM = _warrantyCardsVM
                  .Where(wc => !warrantyRequestIds.Contains(wc.WarrantyCardId))
                  .ToList();
        }
        private void ApplySearchParams()
        {
            //Search by keyword if keyword is not empty
            if (!string.IsNullOrEmpty(_query.ProductName))
            {
                _warrantyCardsVM = _warrantyCardsVM
                    .Where(wc => wc.ProductName != null && wc.ProductName.Contains(_query.ProductName,
                    StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            //Applies pagination
            _warrantyCardsVM = _warrantyCardsVM.Skip((_query.PageIndex - 1) * _query.PageSize)
                    .Take(_query.PageSize).ToList();
        }
        private async Task<ViewModels.WarrantyCard> GetWarrantyCardVM(WarrantyCards warrantyCard)
        {
            Domain.Entities.Products product = await _uow.ProductRepo.GetByIdAsync(warrantyCard.ProductId);
            return new ViewModels.WarrantyCard
            {
                WarrantyCardId = warrantyCard.WarrantyCardId,
                ProductName = product.Name,
                ImageUrl = product.ImageUrl,
                StartDate = warrantyCard.StartDate,
                ExpireDate = warrantyCard.ExpireDate,
            };
        }
    }
}
