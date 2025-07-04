﻿using AutoMapper;
using Sales.Application.Commands;
using Sales.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Mappers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Products, AddProductCommand>().ReverseMap();
            CreateMap<ServicePackages, AddServicePackageCommand>().ReverseMap();
            CreateMap<Contracts, CheckServicePackagePaymentCommand>().ReverseMap();
            CreateMap<Contracts, SuccessSPOnlinePaymentCommand>().ReverseMap();
        }
    }
}
