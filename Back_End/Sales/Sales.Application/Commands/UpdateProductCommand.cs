using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Commands
{
    public class UpdateProductCommand : IRequest<(int, string)>
    {
        public required string ProductId { get; set; }

        [StringLength(255, MinimumLength = 4)]
        public required string Name { get; set; }

        [StringLength(int.MaxValue, MinimumLength = 4)]
        public required string Description { get; set; }

        public IFormFile? Image { get; set; }

        public int InOfStock { get; set; }

        public int WarantyMonths { get; set; }

        public int Price { get; set; }
    }
}
