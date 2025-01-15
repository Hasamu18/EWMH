using AutoMapper;
using MediatR;
using MongoDB.Driver.Core.Operations;
using Requests.Application.Queries;
using Requests.Application.ViewModels;
using Requests.Domain.Entities;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Handlers
{
    internal class GetLeaderDetailsHandler : IRequestHandler<GetLeaderDetailsQuery, LeaderDetails>
    {
        private readonly IUnitOfWork _uow;             
        private GetLeaderDetailsQuery _query;
        private IMapper _mapper;
        public GetLeaderDetailsHandler(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<LeaderDetails> Handle(GetLeaderDetailsQuery query, CancellationToken cancellationToken)
        {
            _query = query;            
            var leader = await FindLeaderByCustomerId();
            var leaderDetails = MapLeaderToLeaderDetails(leader);
            return leaderDetails;   
        }        
        private async Task<Accounts> FindLeaderByCustomerId() {
            var rooms = (await _uow.RoomRepo.GetAsync(room => room.CustomerId == _query.CustomerId))
               .ToList();
            var room = rooms.FirstOrDefault();
            var apartmentArea = await _uow.ApartmentAreaRepo.GetByIdAsync(room.AreaId);
            var leader = await _uow.AccountRepo.GetByIdAsync(apartmentArea.LeaderId);
            return leader;
        }
        private LeaderDetails MapLeaderToLeaderDetails(Accounts leader)
        {
            var result = _mapper.Map<LeaderDetails>(leader);
            result.LeaderId = leader.AccountId; 
            return result;
        }


    }
}
