using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using static Users.Application.Utility.Constants;

namespace Users.Application.Utility
{
    public static class Tools
    {
        public static string GenerateRandomString(int length)
        {
            Random random = new();
            const string chars = "abcde01fghi23jklm45nopq67rstu89vwxyz";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public static async Task<List<string?>> GetAllRole()
        {
            return await Task.Run(() =>
            {
                return typeof(Role)
                    .GetFields(BindingFlags.Public | BindingFlags.Static)
                    .Select(f => f.GetValue(null)!.ToString())
                    .Where(value => !string.IsNullOrEmpty(value))
                    .ToList();
            });
        }

        public static DateTime GetDynamicTimeZone()
        {
            DateTime utcNow = DateTime.UtcNow;
            // Sử dụng múi giờ Việt Nam theo tiêu chuẩn IANA
            TimeZoneInfo vnTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
            DateTime vnTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vnTimeZone);
            return vnTime;
        }
    }
}
