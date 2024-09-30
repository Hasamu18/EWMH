using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using MailKit.Security;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Utility
{
    public class EmailSender
    {
        private readonly IConfiguration _config;
        public EmailSender(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage, IFormFile? attachment = null)
        {
            var message = new MimeMessage();
            message.Sender = new MailboxAddress(subject, _config["MailSettings:Mail"]);
            message.From.Add(new MailboxAddress("Sep490", _config["MailSettings:Mail"]));
            message.To.Add(MailboxAddress.Parse(email));
            message.Subject = subject;

            var builder = new BodyBuilder();
            builder.HtmlBody = htmlMessage;

            // Đính kèm tệp từ IFormFile (nếu có)
            if (attachment != null)
            {
                var pdfAttachment = new MimePart()
                {
                    Content = new MimeContent(attachment.OpenReadStream(), ContentEncoding.Default),
                    ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                    ContentTransferEncoding = ContentEncoding.Base64,
                    FileName = attachment.FileName
                };
                builder.Attachments.Add(pdfAttachment);
            }

            message.Body = builder.ToMessageBody();

            // Sử dụng SmtpClient của MailKit
            using var smtp = new MailKit.Net.Smtp.SmtpClient();

            try
            {
                int port = Int32.Parse(_config["MailSettings:Port"]!);
                smtp.Connect(_config["MailSettings:Host"], port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_config["MailSettings:Mail"], _config["MailSettings:Password"]);
                await smtp.SendAsync(message);
            }
            catch
            {
                // Gửi mail thất bại, nội dung email sẽ lưu vào thư mục MailFail
                System.IO.Directory.CreateDirectory("MailFail");
                var emailsavefile = string.Format(@"MailFail/{0}.eml", Guid.NewGuid());
                await message.WriteToAsync(emailsavefile);
            }
            smtp.Disconnect(true);
        }
    }
}
