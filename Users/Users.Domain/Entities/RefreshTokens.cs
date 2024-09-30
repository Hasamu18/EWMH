using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Domain.Entities
{
    [FirestoreData]
    public sealed class RefreshTokens
    {

        [FirestoreProperty]
        public required string Uid { get; set; }

        [FirestoreProperty]
        public required string Token { get; set; }

        [FirestoreProperty]
        public required string ExpiredAt { get; set; }
    }
}
