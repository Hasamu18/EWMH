using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sales.Application.Commands
{
    public class ScanContractCommand : IRequest<(int, string)>
    {
        public required string ContractId { get; set; }
        public required IFormFile File { get; set; }
    }
}
