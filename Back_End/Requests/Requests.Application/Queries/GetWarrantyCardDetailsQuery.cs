using Google.Api.Gax.ResourceNames;
using MediatR;
using Requests.Application.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Queries
{
    public class GetWarrantyCardDetailsQuery : IRequest<WarrantyCardDetails>
    {

        public string WarrantyCardId { get; set; } = null!;

        public GetWarrantyCardDetailsQuery(string warrantyCardId)
        {
            WarrantyCardId = warrantyCardId;
        }
    }
}
