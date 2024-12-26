using Logger.Utility;
using MediatR;
using Microsoft.Extensions.Configuration;
using Requests.Application.Commands;
using Requests.Application.Mappers;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Handlers
{
    internal class CreateNewRequestForCusHandler : IRequestHandler<CreateNewRequestForCusCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public CreateNewRequestForCusHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(CreateNewRequestForCusCommand request, CancellationToken cancellationToken)
        {
            var existingRoom = (await _uow.RoomRepo.GetAsync(a => (a.CustomerId ?? "").Equals(request.CustomerId))).First();
            var getApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.AreaId.Equals(existingRoom.AreaId))).ToList();

            var getRoom = (await _uow.RoomRepo.GetAsync(a => a.AreaId.Equals(getApartment[0].AreaId) &&
                                                             a.RoomId.Equals(request.RoomId))).ToList();
            if (getRoom.Count == 0)
                return (404, $"Mã phòng: {request.RoomId} không tồn tại ");

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

            var requestId = $"RQ_{Tools.GetDynamicTimeZone():yyyyMMddHHmmss}_{request.CustomerId}";
            var newRequest = RequestMapper.Mapper.Map<Requests.Domain.Entities.Requests>(request);

            if (request.CategoryRequest == Request.CategoryRequest.Warranty)
            {
                newRequest.ContractId = null;
            }
            else
            {
                var getContracts = (await _uow.ContractRepo.GetAsync(a => a.CustomerId.Equals(request.CustomerId) && a.OrderCode != 2)).ToList();
                if (getContracts.Count == 0)
                    newRequest.ContractId = null;
                else
                {
                    var contractWithMinRequests = getContracts.OrderBy(c => c.RemainingNumOfRequests).ToList();
                    foreach (var contract in contractWithMinRequests)
                    {
                        int i = 0;
                        i++;
                        if (contract.RemainingNumOfRequests != 0)
                        {
                            newRequest.ContractId = contract.ContractId;
                            contract.RemainingNumOfRequests -= 1;
                            await _uow.ContractRepo.UpdateAsync(contract);
                            break;
                        }
                        else if (contract.RemainingNumOfRequests == 0 && contractWithMinRequests.Count == i)
                            newRequest.ContractId = null;
                    }
                }
            }

            newRequest.RequestId = requestId;
            newRequest.LeaderId = getApartment[0].LeaderId;
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

            return (201, $"Yêu cầu mới cho mã phòng: {request.RoomId} tại chung cư {getApartment[0].Name} đã được tiếp nhận!");
        }
    }
}
