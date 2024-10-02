using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Mappers;
using Users.Application.Queries;
using Users.Application.Utility;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class AddApartmentHandler : IRequestHandler<AddApartmentCommand, string>
    {
        private readonly IUnitOfWork _uow;
        public AddApartmentHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<string> Handle(AddApartmentCommand request, CancellationToken cancellationToken)
        {
            var existingApartment = await _uow.ApartmentAreaRepo.GetAsync(a => a.Name.Equals(request.Name));
            if (existingApartment.Any())
                return $"{request.Name} apartment is existing, choose another name";

            var apartmentArea = UserMapper.Mapper.Map<ApartmentAreas>(request);
            apartmentArea.AreaId = Tools.GenerateIdFormat32();
            await _uow.ApartmentAreaRepo.AddAsync(apartmentArea);
            
            return $"{request.Name} apartment is added";
        }
    }
}
