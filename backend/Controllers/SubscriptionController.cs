using Expense_Tracker___Backend.Data;
using Expense_Tracker___Backend.Dto;
using Expense_Tracker___Backend.Models;
using Expense_Tracker___Backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Expense_Tracker___Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public SubscriptionController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetSubscriptions()
        {
            string email = JWTUtil.GetValue(HttpContext);
            var subscriptions = await _dbContext.Recurring
                .Join(
                    _dbContext.Category,
                        r => r.Category,
                        c => c.Id,
                        (r, c) => new {
                            r.Id,
                            r.Interval,
                            r.User,
                            r.Note,
                            r.Amount,
                            r.Status,
                            c.Name,
                            c.Type
                        }
                )
                .ToListAsync();
            return Ok(new
            {
                status = true,
                subscriptions
            });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddSubscription([FromForm] AddSubscriptionDto addSubscriptionDto)
        {
            try
            {
                string email = JWTUtil.GetValue(HttpContext);
                RecurringModel model = new()
                {
                    Note = addSubscriptionDto.Note,
                    Amount = addSubscriptionDto.Amount,
                    User = email,
                    Interval = addSubscriptionDto.Interval,
                    Category = addSubscriptionDto.Category,
                    Status = "Active"
               };
                _dbContext.Recurring.Add(model);
                await _dbContext.SaveChangesAsync();
                return Ok(new
                {
                    status = true,
                    recurring = model
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

        [HttpPatch]
        [Authorize]
        public async Task<IActionResult> UpdateSubscription([FromForm] UpdateSubscriptionDto updateSubscriptionDto) 
        {
            try
            {
                var subscription = await _dbContext.Recurring.FirstOrDefaultAsync(r => r.Id == updateSubscriptionDto.Id);
                subscription!.Status = updateSubscriptionDto.Status;
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

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteSubscription(IFormCollection form)
        {
            try
            {
                var subscription = await _dbContext.Recurring.FirstOrDefaultAsync(r => r.Id == Convert.ToInt32(form["Id"]));
                _dbContext.Recurring.Remove(subscription!);
                await _dbContext.SaveChangesAsync();
                return Ok(new
                {
                    status = true
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
