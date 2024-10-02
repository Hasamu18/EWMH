using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class UpdateApartmentHandler : IRequestHandler<UpdateApartmentCommand, string>
    {
        private readonly IUnitOfWork _uow;
        public UpdateApartmentHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<string> Handle(UpdateApartmentCommand request, CancellationToken cancellationToken)
        {
            var existingApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.AreaId.Equals(request.AreaId))).ToList();
            if (existingApartment.Count == 0)
                return "Unexisted apartment";

            var existingName = await _uow.ApartmentAreaRepo.GetAsync(a => a.Name.Equals(request.Name));
            if (existingName.Any())
                return $"{request.Name} apartment is existing, choose another name";

            existingApartment[0].Name = request.Name;
            existingApartment[0].Description = request.Description;
            existingApartment[0].Address = request.Address;
            existingApartment[0].ManagementCompany = request.ManagementCompany;
            await _uow.ApartmentAreaRepo.UpdateAsync(existingApartment[0]);

            return $"{request.Name} apartment is updated";
        }
    }
}
