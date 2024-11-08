using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.ViewModels
{
    public class LeaderDetails
    {
        public string LeaderId { get; set; } = null!;

        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;        

        public string PhoneNumber { get; set; } = null!;

        public string AvatarUrl { get; set; } = null!;

        public DateOnly DateOfBirth { get; set; }        
    }
}
