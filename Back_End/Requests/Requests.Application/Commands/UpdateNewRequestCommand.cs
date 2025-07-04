﻿using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Commands
{
    public class UpdateNewRequestCommand : IRequest<(int, string)>
    {
        public required string RequestId { get; set; }

        public required string RoomId { get; set; }

        public required string CustomerProblem { get; set; }
    }
}
