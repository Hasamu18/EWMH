using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Logger.Utility;
using Users.Domain.Entities;

namespace Users.Application.Queries
{
    public class GetPagedAccountQuery : IRequest<List<Accounts>>
    {
        public int PageIndex { get; set; } = 1;

        public int Pagesize { get; set; } = 8;

        public string? SearchByEmail { get; set; } = null;

        public string? Role { get; set; } = null;

        public bool? IsDisabled { get; set; } = null;
    }
}
