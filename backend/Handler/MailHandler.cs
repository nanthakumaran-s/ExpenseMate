using SendGrid;
using SendGrid.Helpers.Mail;
using System.Net.Mail;

namespace Expense_Tracker___Backend.Handler
{
    public class MailHandler
    {
        public static void SendMail(string subject, string email, string name, string text, string? html = null)
        {
            string apiKey = Environment.GetEnvironmentVariable("SENDGRID")!;
            if (apiKey != null)
            {

                var client = new SendGridClient(apiKey);
                var from = new EmailAddress("riyazurrazakn.19ece@kongu.edu", "no-reply@expensemate");
                var to = new EmailAddress(email, name);
                var msg = MailHelper.CreateSingleEmail(from, to, subject, text, html == null ? text : html);
                var response = client.SendEmailAsync(msg).Result;
                Console.WriteLine(response);
            }
        }
    }
}
