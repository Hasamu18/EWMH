using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Logger.Utility
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

        public static string GenerateRandomDigits(int length)
        {
            Random random = new();
            const string chars = "0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public static string HashString(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

                StringBuilder builder = new();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        public static string GenerateIdFormat32()
        {
            return Guid.NewGuid().ToString().Replace("-", "");
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

        public static string EncryptString(string aString)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes("9utjwQbRFAVj1Kt5lOVWi9tAwQbRFAVj");//SecretKey
                aesAlg.GenerateIV();

                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                byte[] emailBytes = Encoding.UTF8.GetBytes(aString);
                byte[] encryptedEmailBytes = encryptor.TransformFinalBlock(emailBytes, 0, emailBytes.Length);

                // Combine IV and encrypted email into one array
                byte[] result = new byte[aesAlg.IV.Length + encryptedEmailBytes.Length];
                Buffer.BlockCopy(aesAlg.IV, 0, result, 0, aesAlg.IV.Length);
                Buffer.BlockCopy(encryptedEmailBytes, 0, result, aesAlg.IV.Length, encryptedEmailBytes.Length);

                return Convert.ToBase64String(result);
            }
        }

        public static string DecryptString(string encryptedString)
        {
            try
            {
                using Aes aesAlg = Aes.Create();
                aesAlg.Key = Encoding.UTF8.GetBytes("9utjwQbRFAVj1Kt5lOVWi9tAwQbRFAVj");//SecretKey
                byte[] fullCipher = Convert.FromBase64String(encryptedString);
                // Extract IV from beginning of array
                byte[] iv = new byte[aesAlg.BlockSize / 8];
                byte[] cipherText = new byte[fullCipher.Length - iv.Length];
                Buffer.BlockCopy(fullCipher, 0, iv, 0, iv.Length);
                Buffer.BlockCopy(fullCipher, iv.Length, cipherText, 0, cipherText.Length);

                aesAlg.IV = iv;
                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                byte[] decryptedEmailBytes = decryptor.TransformFinalBlock(cipherText, 0, cipherText.Length);

                return Encoding.UTF8.GetString(decryptedEmailBytes);
            }
            catch
            {
                return "null";
            }
            
        }
    }
}
