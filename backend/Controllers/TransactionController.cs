using Expense_Tracker___Backend.Data;
using Expense_Tracker___Backend.Dto;
using Expense_Tracker___Backend.Helpers;
using Expense_Tracker___Backend.Models;
using Expense_Tracker___Backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Expense_Tracker___Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public TransactionController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddTransaction([FromForm] AddTransactionDto transactionDto) 
        {
            try
            {
                string email = JWTUtil.GetValue(HttpContext);
                var user = await _dbContext.User.FindAsync(email);
                var category = await _dbContext.Category.FindAsync(transactionDto.Category);
                decimal closingBalance = 0;
                if (category?.Type == "Income")
                {
                    closingBalance = user!.Balance + transactionDto.Amount;
                } else
                {
                    closingBalance = user!.Balance - transactionDto.Amount;
                }
                TransactionModel transaction = new()
                {
                    User = email,
                    Amount = transactionDto.Amount,
                    Category = transactionDto.Category,
                    Date = transactionDto.Date,
                    Note = transactionDto.Note,
                    Opening = user.Balance,
                    Closing = closingBalance,
                };
                user.Balance = closingBalance;
                _dbContext.Transaction.Add(transaction);
                _dbContext.User.Update(user);
                await _dbContext.SaveChangesAsync();
                await CheckBudget.Check(_dbContext, email);
                return Ok(new {
                    status = true,
                    transaction
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

        [HttpGet("recent")]
        [Authorize]
        public async Task<IActionResult> GetRecent()    
        {
            try
            {
                string email = JWTUtil.GetValue(HttpContext);
                var now = DateTime.Now;
                var custom = now.AddDays(-90);
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
                    .Where(t => t.User == email && t.Date > custom)
                    .OrderByDescending(t => t.Date)
                    .ToListAsync();
                return Ok(new
                {
                    status = true,
                    transactions
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

        [HttpGet("monthly")]
        [Authorize]
        public async Task<IActionResult> GetMonthlyReports()
        {
            try
            {
                var email = JWTUtil.GetValue(HttpContext);
                var dt = DateTime.Now;
                var month = dt.Month;
                var reports = await _dbContext.Transaction
                    .Join(
                        _dbContext.Category,
                        t => t.Category,
                        c => c.Id,
                        (t, c) => new
                        {
                            t.Note,
                            t.Opening,
                            t.Closing,
                            t.Date,
                            t.Amount,
                            t.User,
                            c.Name,
                            c.Type
                        }
                    )
                    .Where(t => t.Date.Month == month && t.User == email)
                    .OrderBy(t => t.Date)
                    .ToListAsync();
                return Ok(new
                {
                    status = true,
                    reports
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

        [HttpGet("custom")]
        [Authorize]
        public async Task<IActionResult> CustomTransaction([FromQuery] CustomTransactionDto customTransaction)
        {
            try
            {
                var email = JWTUtil.GetValue(HttpContext);
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
                    .Where(t => t.Date >= customTransaction.From && t.Date <= customTransaction.To && t.User == email)
                    .OrderByDescending(t => t.Date)
                    .ToListAsync();
                return Ok(new
                {
                    status = true,
                    transactions,
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
    }
}
