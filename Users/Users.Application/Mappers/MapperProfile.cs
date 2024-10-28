using AutoMapper;
using FirebaseAdmin.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Domain.Entities;

namespace Users.Application.Mappers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Accounts, CreatePersonnelCommand>().ReverseMap();
            CreateMap<Accounts, CreateCustomerCommand>().ReverseMap();
            CreateMap<ApartmentAreas, AddApartmentCommand>().ReverseMap();
            CreateMap<PendingAccounts, PendingApprovalCreateCustomerCommand>().ReverseMap();
        }
    }
}
