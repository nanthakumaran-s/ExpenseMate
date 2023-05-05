using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Expense_Tracker___Backend.Data;
using Expense_Tracker___Backend.Dto;
using Expense_Tracker___Backend.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.EntityFrameworkCore;
using System;

namespace Expense_Tracker___Backend.Helpers
{
    public class GenerateInvoiceHelper
    {

        public static async Task Generate(ApplicationDbContext _dbContext, string email, CustomTransactionDto transactionDto)
        {
            string fileName = "invoice-" + Guid.NewGuid() + ".pdf";
            string directoryPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "PDFs");
            Directory.CreateDirectory(directoryPath);
            string filePath = Path.Combine(directoryPath, fileName);

            Console.WriteLine(filePath);

            var document = new Document();
            var writer = PdfWriter.GetInstance(document, new FileStream(filePath, FileMode.Create));
            document.Open();

            Paragraph body = new Paragraph("Invoice Statement");
            document.Add(body);

            Paragraph body1 = new Paragraph($"From: {transactionDto.From} -> To: {transactionDto.To}");
            document.Add(body1);

            Paragraph body2 = new Paragraph("");
            document.Add(body2);


            var transactions = await _dbContext.Transaction
                    .Join(
                        _dbContext.Category,
                        t => t.Category,
                        c => c.Id,
                        (t, c) => new {
                            t.User,
                            t.Date,
                            t.Note,
                            t.Opening,
                            t.Closing,
                            t.Amount,
                            c.Name,
                            c.Type
                        }
                    )
                    .Where(t => t.Date >= transactionDto.From && t.Date <= transactionDto.To && t.User == email)
                    .OrderByDescending(t => t.Date)
                    .ToListAsync();
            var table = new PdfPTable(7);
            table.AddCell("Type");
            table.AddCell("Amount");
            table.AddCell("Note");
            table.AddCell("Category");
            table.AddCell("Opening Balance");
            table.AddCell("Closing Balance");
            table.AddCell("Date");

            foreach (var item in transactions)
            {
                table.AddCell(item.Type);
                table.AddCell(item.Amount.ToString());
                table.AddCell(item.Note);
                table.AddCell(item.Name);
                table.AddCell(item.Opening.ToString());
                table.AddCell(item.Closing.ToString());
                table.AddCell(item.Date.ToString());
            }
            document.Add(table);

            document.Close();
            writer.Dispose();

            var credentials = new BasicAWSCredentials(
                Environment.GetEnvironmentVariable("AWS_ACCESS_KEY")!,
                Environment.GetEnvironmentVariable("AWS_SECRET_KEY")!
            );
            var config = new AmazonS3Config { RegionEndpoint = RegionEndpoint.USEast1 };
            var client = new AmazonS3Client(credentials, config);

            var request = new PutObjectRequest()
            {
                BucketName = "expensemate-invoice-store",
                Key = "invoice/" + fileName,
                FilePath = filePath
            };
            var response = await client.PutObjectAsync(request);

            InvoiceModel model = new() {
                CreatedDate = DateTime.Now,
                IncvoiceName = fileName,
                InvoiceURL = "https://expensemate-invoice-store.s3.amazonaws.com/invoice/" + fileName,
                User = email,
            };
            _dbContext.Invoice.Add(model);
            await _dbContext.SaveChangesAsync();
        }
    }
}
