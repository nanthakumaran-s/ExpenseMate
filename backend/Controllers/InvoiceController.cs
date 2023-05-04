using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Expense_Tracker___Backend.Data;
using Expense_Tracker___Backend.Dto;
using Expense_Tracker___Backend.Helpers;
using Expense_Tracker___Backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Expense_Tracker___Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public InvoiceController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> GenerateInvoice([FromForm] CustomTransactionDto transactionDto)
        {
            try
            {
                var email = JWTUtil.GetValue(HttpContext);
                var invoices = await _dbContext.Invoice.Where(i => i.User == email).ToListAsync();
                var user = _dbContext.User.FirstOrDefault(u => u.Email == email);
                if (invoices.Count == 5 && user.Subscription == "Free")
                {
                    return Ok(new
                    {
                        status = false,
                        message = "Invoices credits ended"
                    });
                }
                await GenerateInvoiceHelper.Generate(_dbContext, email, transactionDto);
                return Ok(new
                {
                    status = true,
                });
            } catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    status = false,
                    message = "Some error occured"
                });
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetInvoice()
        {
            try
            {
                var email = JWTUtil.GetValue(HttpContext);
                var invoices = await _dbContext.Invoice.Where(i => i.User == email).OrderByDescending(i => i.CreatedDate).ToListAsync();
                return Ok(new
                {
                    status = true,
                    invoices
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    status = false,
                    message = "Some error occured"
                });
            }
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteInvoice([FromForm] int id)
        {
            try
            {
                var model = _dbContext.Invoice.FirstOrDefault(i => i.Id == id);
                _dbContext.Invoice.Remove(model!);
                await _dbContext.SaveChangesAsync();
                return Ok(new
                {
                    status = true,
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    status = false,
                    message = "Some error occured"
                });
            }
        }

        [HttpGet("download")]
        [Authorize]
        public async Task<IActionResult> GetFile([FromQuery] int id)
        {
            var credentials = new BasicAWSCredentials(
                Environment.GetEnvironmentVariable("AWS_ACCESS_KEY")!,
                Environment.GetEnvironmentVariable("AWS_SECRET_KEY")!
            );
            var config = new AmazonS3Config { RegionEndpoint = RegionEndpoint.USEast1 };
            var client = new AmazonS3Client(credentials, config);

            try
            {
                var invoice = _dbContext.Invoice.FirstOrDefault(i => i.Id == id);
                GetObjectResponse response = await client.GetObjectAsync("expensemate-invoice-store", "invoice/" + invoice!.IncvoiceName);
                return File(response.ResponseStream, response.Headers.ContentType);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    status = false,
                    message = "Some error occured"
                });
            }
        }
    }
}
