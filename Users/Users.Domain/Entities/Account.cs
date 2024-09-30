using Google.Cloud.Firestore;

namespace Users.Domain.Entities
{
    [FirestoreData]
    public sealed class Account
    {
        [FirestoreProperty]
        public required string Uid { get; set; }

        [FirestoreProperty]
        public required string DisplayName { get; set; }

        [FirestoreProperty]
        public string? Email { get; set; }

        [FirestoreProperty]
        public string? PhoneNumber { get; set; }

        [FirestoreProperty]
        public required string PhotoUrl { get; set; }

        [FirestoreProperty]
        public string? StatusInText { get; set; }

        [FirestoreProperty]
        public required string Role { get; set; }

        [FirestoreProperty]
        public required string CreatedAt { get; set; }
    }
}
