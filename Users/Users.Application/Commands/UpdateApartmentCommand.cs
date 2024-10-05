using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Commands
{
    public class UpdateApartmentCommand : IRequest<(int, string)>
    {
        public required string AreaId { get; set; }

        [StringLength(255, MinimumLength = 4)]
        public required string Name { get; set; }

        [StringLength(int.MaxValue, MinimumLength = 4)]
        public required string Description { get; set; }

        [StringLength(int.MaxValue, MinimumLength = 4)]
        public required string Address { get; set; }

        [StringLength(255, MinimumLength = 4)]
        public required string ManagementCompany { get; set; }

        public required IFormFile Image { get; set; }

        public required string LeaderId { get; set; }
    }
}
