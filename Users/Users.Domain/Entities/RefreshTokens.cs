using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Domain.Entities
{
    public sealed class RefreshTokens
    {
        public required string AccountId { get; set; }

        public required string Token { get; set; }

        public DateTime ExpiredAt { get; set; }
    }
}
