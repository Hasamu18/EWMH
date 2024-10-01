using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Responses;
using Users.Domain.Entities;

namespace Users.Application.Commands
{
    public class UpdatePhotoAccountCommand : IRequest<string>
    {
        public string AccountId { get; set; }

        public IFormFile Image { get; set; }
        public UpdatePhotoAccountCommand(string accountId, IFormFile image)
        {
            AccountId = accountId;
            Image = image;
        }
    }
}
