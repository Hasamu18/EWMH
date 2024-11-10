using AutoMapper;
using Microsoft.Extensions.Options;
using Requests.Application.Commands;
using Requests.Application.ViewModels;
using Requests.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Mappers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Domain.Entities.Requests, CreateNewRequestCommand>().ReverseMap();
            CreateMap<Domain.Entities.Requests, ViewModels.Request>().ReverseMap();
            CreateMap<Domain.Entities.Accounts, ViewModels.LeaderDetails>()
                .ForMember(dest => dest.LeaderId, opt => opt.Ignore()) 
            .ReverseMap();
            CreateMap<Domain.Entities.WarrantyCards, ViewModels.WarrantyCardDetails>().ReverseMap();
            CreateMap<Domain.Entities.Feedbacks, ViewModels.CustomerFeedback>().ReverseMap();
            //CreateMap<ServicePackages, AddServicePackageCommand>().ReverseMap();
            //CreateMap<Contracts, CheckServicePackagePaymentCommand>().ReverseMap();
            //CreateMap<Contracts, SuccessSPOnlinePaymentCommand>().ReverseMap();
        }
    }
}
