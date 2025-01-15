using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class AddPreRepairEvidenceToRequestCommand : IRequest<(int, string)>
    {
        public required string RequestId { get; set; }

        public required IFormFile File { get; set; }
    }
}
