using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logger.Utility
{
    public static class Constants
    {
        public class Role
        {
            public const string AdminRole = "ADMIN";
            public const string ManagerRole = "MANAGER";
            public const string TeamLeaderRole = "LEADER";
            public const string WorkerRole = "WORKER";
            public const string CustomerRole = "CUSTOMER";
        }

        public class Request
        {
            public enum Status
            {
                Requested = 0, Processing = 1, Done = 2, Canceled = 3
            }

            public enum CategoryRequest
            {
                Warranty = 0, Repair = 1
            }
        }
    }
}
