using MediatR;
using Microsoft.EntityFrameworkCore;
using Requests.Application.Commands;
using Requests.Application.Mappers;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Requests.Application.Handlers
{
    internal class CreateNewRequestHandler : IRequestHandler<CreateNewRequestCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        public CreateNewRequestHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<(int, string)> Handle(CreateNewRequestCommand request, CancellationToken cancellationToken)
        {
            //var getLeader = (await _uow.ApartmentAreaRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId))).ToList();

            //var getRoom = (await _uow.RoomRepo.GetAsync(a => a.AreaId.Equals(getLeader[0].AreaId) &&
            //                                                 a.RoomId.Equals(request.RoomId))).ToList();
            //if (getRoom.Count == 0)
            //    return (404, $"Unexisted {getRoom[0].RoomId} room ");

            //if (getRoom[0].CustomerId is null)
            //    return (404, $"{getRoom[0].RoomId} room");

            //var requestId = $"RQ_{(await _uow.RequestRepo.Query().CountAsync() + 1):D10}";
            //var newRequest = RequestMapper.Mapper.Map<Requests.Domain.Entities.Requests>(request);
            //newRequest.RequestId = requestId;
            //newRequest.CustomerId = getRoom[0].CustomerId;
            //product.ImageUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            //product.Status = false;
            //await _uow.ProductRepo.AddAsync(product);
            return (200, "");
        }

        private bool IsEmail(string input)
        {
            var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            return emailRegex.IsMatch(input);
        }
    }
}
