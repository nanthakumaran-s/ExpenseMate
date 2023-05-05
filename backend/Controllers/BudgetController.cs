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
    public class BudgetController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public BudgetController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddBudget([FromForm] AddBudgetDto addBudgetDto)
        {
            try
            {
                var email = JWTUtil.GetValue(HttpContext);
                var budgets = await _dbContext.Budget.Where(b => b.User == email).ToListAsync();
                var user = await _dbContext.User.FirstOrDefaultAsync(u => u.Email == email);
                if(user!.Subscription == "Free" && budgets.Count > 0)
                {
                    return Ok(new
                    {
                        status = false,
                        message = "Budget already exist"
                    });
                }
                BudgetModel model = new()
                {
                    Category = addBudgetDto.Category == 0 ? 6 : addBudgetDto.Category,
                    Limit = addBudgetDto.Limit,
                    Type = "Monthly",
                    User = email
                };
                _dbContext.Budget.Add(model);
                await _dbContext.SaveChangesAsync();
                return Ok(new
                {
                    status = true,
                    budget = model
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

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetBudgets()
        {
            try
            {
                var email = JWTUtil.GetValue(HttpContext);
                var budgets = await _dbContext.Budget
                    .Join(
                        _dbContext.Category,
                        b => b.Category,
                        c => c.Id,
                        (b, c) => new
                        {
                            b.Id,
                            b.Type,
                            b.Limit,
                            b.User,
                            c.Name,
                            CategoryType = c.Type,
                        }
                    )
                    .Where(b => b.User == email)
                    .ToListAsync();
                var thresholds = new List<List<ThresholdModel>>();
                foreach ( var b in budgets )
                {
                    var threshold = await _dbContext.Threshold.Where(t => t.Budget == b.Id).ToListAsync();
                    thresholds.Add(threshold);
                }
                return Ok(new
                {
                    status = true,
                    budgets,
                    thresholds
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

        [HttpGet("threshold")]
        [Authorize]
        public async Task<IActionResult> GetThreshold([FromForm] int budget)
        {
            try
            {
                Console.WriteLine("Budget ID from client: " + budget);
                var thresholds = await _dbContext.Threshold.Where(t => t.Budget == budget).ToListAsync();
                return Ok(new { 
                    status = true,
                    thresholds
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

        [HttpPost("threshold")]
        [Authorize]
        public async Task<IActionResult> AddThreshold([FromForm] AddThresholdDto addThresholdDto)
        {
            try
            {
                ThresholdModel model = new()
                {
                    Budget = addThresholdDto.BudgetId,
                    Percentage = addThresholdDto.Percentage,
                    Status = "Active"
                };
                _dbContext.Threshold.Add(model);
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
        public async Task<IActionResult> DeleteBudget([FromForm] int id)
        {
            try
            {
                var thresholds = await _dbContext.Threshold.Where(t => t.Budget == id).ToListAsync();
                for(int i = 0; i < thresholds.Count; i++)
                {
                    _dbContext.Threshold.Remove(thresholds[i]);
                }
                var budget = _dbContext.Budget.FirstOrDefault(b => b.Id == id);
                _dbContext.Budget.Remove(budget!);
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
    }
}
