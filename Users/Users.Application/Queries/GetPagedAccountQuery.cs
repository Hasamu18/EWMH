using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Utility;
using Users.Domain.Entities;

namespace Users.Application.Queries
{
    public class GetPagedAccountQuery : IRequest<object>
    {
        [Range(1, int.MaxValue)]
        public int PageIndex { get; set; } = 1;

        [Range(1, int.MaxValue)]
        public int Pagesize { get; set; } = 5;

        public string? SearchValue { get; set; } = null;

        public required string SortField { get; set; } = "Role";

        public bool IsAsc { get; set; } = true;
    }
}
