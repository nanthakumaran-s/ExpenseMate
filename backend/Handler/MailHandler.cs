using SendGrid;
using SendGrid.Helpers.Mail;
using System.Net.Mail;

namespace Expense_Tracker___Backend.Handler
{
    public class MailHandler
    {
        public static void SendMail(string subject, string email, string name, string text)
        {
            string apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY")!;
            Console.WriteLine(apiKey);
            if (apiKey != null)
            {

                var client = new SendGridClient(apiKey);
                var from = new EmailAddress("nanthakumaran.ofcl+no-reply@gmail.com", "Nanthakumaran S");
                var to = new EmailAddress(email, name);
                var msg = MailHelper.CreateSingleEmail(from, to, subject, text, text);
                var response = client.SendEmailAsync(msg).Result;
                Console.WriteLine(response);
            }
        }
    }
}
