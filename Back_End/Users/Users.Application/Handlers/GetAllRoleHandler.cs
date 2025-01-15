using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Queries;
using Logger.Utility;

namespace Users.Application.Handlers
{
    public class GetAllRoleHandler : IRequestHandler<GetAllRoleQuery, List<string?>>
    {        
        public async Task<List<string?>> Handle(GetAllRoleQuery request, CancellationToken cancellationToken)
        {
            var roles = await Tools.GetAllRole();
            return roles;
        }
    }
}
