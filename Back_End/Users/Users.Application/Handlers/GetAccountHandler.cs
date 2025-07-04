﻿using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Commands;
using Users.Application.Queries;
using Users.Application.Responses;
using Users.Domain.Entities;
using Users.Domain.IRepositories;

namespace Users.Application.Handlers
{
    public class GetAccountHandler : IRequestHandler<GetAccountQuery, (int, TResponse<object>)>
    {
        private readonly IUnitOfWork _uow;
        public GetAccountHandler(IUnitOfWork uow)
        {
            _uow = uow;
        }
        public async Task<(int, TResponse<object>)> Handle(GetAccountQuery request, CancellationToken cancellationToken)
        {
            var existingUser = (await _uow.AccountRepo.GetAsync(a => a.AccountId.Equals(request.AccountId))).ToList();
            if (existingUser.Any())
            {
                if (existingUser[0].Role.Equals("LEADER"))
                {
                    var getApartment = (await _uow.ApartmentAreaRepo.GetAsync(a => a.LeaderId.Equals(existingUser[0].AccountId))).ToList();
                    if (getApartment.Count != 0)
                    {
                        return (200, new TResponse<object>
                        {
                            Message = "Thành công",
                            Response = new
                            {
                                User = existingUser[0],
                                Apartment = getApartment
                            }
                        });
                    }
                }
                else if (existingUser[0].Role.Equals("CUSTOMER"))
                {
                    var getArea = (await _uow.RoomRepo.GetAsync(a => (a.CustomerId ?? "").Equals(request.AccountId))).ToList();
                    if (getArea.Count != 0)
                    {
                        var getApartment = await _uow.ApartmentAreaRepo.GetByIdAsync(getArea[0].AreaId);
                        var getLeader = await _uow.AccountRepo.GetByIdAsync(getApartment!.LeaderId);
                        return (200, new TResponse<object>
                        {
                            Message = "Thành công",
                            Response = new
                            {
                                Customer = existingUser[0],
                                Leader = getLeader,
                                Apartment = getApartment,
                                Rooms = getArea.Select(s => s.RoomId).ToList()
                            }
                        });
                    }
                }
                return (200, new TResponse<object>
                {
                    Message = "Thành công",
                    Response = existingUser[0]
                });
            }
                
            return (404, new TResponse<object>
            {
                Message = "Người dùng không tồn tại",
                Response = null
            });
        }

    }
}
