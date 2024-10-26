using AutoMapper;
using Requests.Application.Commands;
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
            CreateMap<Requests.Domain.Entities.Requests, CreateNewRequestCommand>().ReverseMap();
            //CreateMap<ServicePackages, AddServicePackageCommand>().ReverseMap();
            //CreateMap<Contracts, CheckServicePackagePaymentCommand>().ReverseMap();
            //CreateMap<Contracts, SuccessSPOnlinePaymentCommand>().ReverseMap();
        }
    }
}
