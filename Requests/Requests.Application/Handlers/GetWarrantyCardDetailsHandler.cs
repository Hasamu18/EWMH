using MediatR;
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
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using AutoMapper;

namespace Requests.Application.Handlers
{
    internal class GetWarrantyCardDetailsHandler : IRequestHandler<GetWarrantyCardDetailsQuery, ViewModels.WarrantyCardDetails>
    {
        private readonly IUnitOfWork _uow;
        private GetWarrantyCardDetailsQuery _query;
        private WarrantyCards _warrantyCard;
        private ViewModels.WarrantyCardDetails _warrantyCardDetailsVM;
        private IMapper _mapper;
        public GetWarrantyCardDetailsHandler(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<ViewModels.WarrantyCardDetails> Handle(GetWarrantyCardDetailsQuery query, CancellationToken cancellationToken)
        {
            _query = query;
            _warrantyCard = (await _uow.WarrantyCardRepo.GetByIdAsync(query.WarrantyCardId));
            await MapWarrantyCardVMFromWarrantyCard();
            return _warrantyCardDetailsVM;
        }        
        private async Task MapWarrantyCardVMFromWarrantyCard()
        {
            _warrantyCardDetailsVM = _mapper.Map<ViewModels.WarrantyCardDetails>(_warrantyCard);
            Domain.Entities.Accounts customer = await _uow.AccountRepo.GetByIdAsync(_warrantyCard.CustomerId);
            Domain.Entities.Products product = await _uow.ProductRepo.GetByIdAsync(_warrantyCard.ProductId);
            _warrantyCardDetailsVM.CustomerName = customer.FullName;
            _warrantyCardDetailsVM.ProductName= product.Name;
            _warrantyCardDetailsVM.ProductImageUrl = product.ImageUrl;
            _warrantyCardDetailsVM.ProductDescription = product.Description;
        }      
    }
}
