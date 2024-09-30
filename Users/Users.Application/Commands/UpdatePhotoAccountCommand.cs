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
    public class UpdatePhotoAccountCommand : IRequest<TResponse<Account>>
    {
        public string Uid { get; set; }

        public IFormFile Photo { get; set; }
        public UpdatePhotoAccountCommand(string uid, IFormFile photo)
        {
            Uid = uid;
            Photo = photo;
        }
    }
}
