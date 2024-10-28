using static Logger.Utility.Constants;
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
using Logger.Utility;
using Requests.Domain.Entities;

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
            var getApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.LeaderId.Equals(request.LeaderId))).ToList();

            var getRoom = (await _uow.RoomRepo.GetAsync(a => a.AreaId.Equals(getApartment[0].AreaId) &&
                                                             a.RoomId.Equals(request.RoomId))).ToList();
            if (getRoom.Count == 0)
                return (404, $"Mã phòng: {getRoom[0].RoomId} không tồn tại ");

            var getCustomerRooms = (await _uow.RoomRepo.GetAsync(a => (a.CustomerId ?? "").Equals(request.CustomerId))).ToList();
            if (getCustomerRooms.Count == 0)
                return (404, $"Khách hàng không sở hữu căn hộ nào tại chung cư {getApartment[0].Name}");

            for (int i = 1; i <= getCustomerRooms.Count; i++)
            {
                if (getCustomerRooms[i - 1].RoomId.Equals(request.RoomId))
                    break;
                else if (!getCustomerRooms[i - 1].RoomId.Equals(request.RoomId) && i == getCustomerRooms.Count)
                    return (409, $"Bạn không sở hữu căn hộ với mã phòng: {getRoom[0].RoomId}");
            }

            var requestId = $"RQ_{(await _uow.RequestRepo.Query().CountAsync() + 1):D10}";
            var newRequest = RequestMapper.Mapper.Map<Requests.Domain.Entities.Requests>(request);

            var getContracts = (await _uow.ContractRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId))).ToList();
            if (getContracts.Count == 0)
            {
                newRequest.ContractId = null;
                newRequest.CategoryRequest = (int)Request.CategoryRequest.Pay;
            }                
            else
            {
                var contractWithMinRequests = getContracts.OrderBy(c => c.RemainingNumOfRequests).First();
                newRequest.ContractId = contractWithMinRequests.ContractId;
                newRequest.CategoryRequest = (int)Request.CategoryRequest.Free;
                contractWithMinRequests.RemainingNumOfRequests -= 1;
                await _uow.ContractRepo.UpdateAsync(contractWithMinRequests);
            }
            
            newRequest.RequestId = requestId;
            newRequest.CustomerId = request.CustomerId;
            newRequest.Start = Tools.GetDynamicTimeZone();
            newRequest.End = null;
            newRequest.Conclusion = null;
            newRequest.Status = (int)Request.Status.Requested;
            newRequest.PurchaseTime = null;
            newRequest.TotalPrice = null;
            newRequest.FileUrl = null;
            newRequest.OrderCode = null;
            newRequest.IsOnlinePayment = null;
            await _uow.RequestRepo.AddAsync(newRequest);

            return (201, $"Yêu cầu sửa chữa cho mã phòng: {request.RoomId} tại chung cư {getApartment[0].Name} đã được tiếp nhận!");
        }
    }
}
