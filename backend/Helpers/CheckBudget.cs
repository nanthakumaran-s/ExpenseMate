using Expense_Tracker___Backend.Data;
using Expense_Tracker___Backend.Dto;
using Expense_Tracker___Backend.Handler;
using Expense_Tracker___Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Expense_Tracker___Backend.Helpers
{
    public class CheckBudget
    {
        public static async Task Check(ApplicationDbContext _dbContext, string email)
        {
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
            foreach(var b in budgets)
            {
                var thresholds = await _dbContext.Threshold.Where(t => t.Budget == b.Id).OrderBy(t => t.Percentage).ToListAsync();
                var dt = DateTime.Now;
                var month = dt.Month;
                decimal spend = 0;
                if (b.Name == "Others")
                {
                    spend = _dbContext.Transaction
                        .Join(
                            _dbContext.Category,
                            t => t.Category,
                            c => c.Id,
                            (t, c) => new
                            {
                                t.Date,
                                t.Amount,
                                t.User,
                                c.Type
                            }
                        )
                        .Where(t => t.Date.Month == month && t.User == email && t.Type == "Expense")
                        .Select(t => t.Amount)
                        .Sum();
                } else
                {
                    spend = _dbContext.Transaction
                        .Join(
                            _dbContext.Category,
                            t => t.Category,
                            c => c.Id,
                            (t, c) => new
                            {
                                t.Date,
                                t.Amount,
                                t.User,
                                c.Name,
                                c.Type
                            }
                        )
                        .Where(t => t.Date.Month == month && t.User == email && t.Type == "Expense" && t.Name == b.Name)
                        .Select(t => t.Amount)
                        .Sum();
                }
                for (int i = 0; i < thresholds.Count; i++)
                {
                    var currentThres = thresholds[i];
                    if (currentThres.Status == "Inactive")
                    {
                        continue;
                    }
                    var reach = b.Limit * Convert.ToDecimal(currentThres.Percentage / 100.00);
                    if (reach <= spend)
                    {
                        currentThres.Status = "Inactive";
                        _dbContext.Threshold.Update(currentThres);
                        await _dbContext.SaveChangesAsync();
                        MailHandler.SendMail(
                           $"{currentThres.Percentage}% of the budget exceeded",
                           b.User!,
                           b.User!,
                           $"You have exeeded your budget \n\n" +
                           $"{(b.Name == "Others" ? "Monthly Budget" : $"Categorical Budget for {b.Name}")} is Exceeded\n" +
                           $"Limit {b.Limit}\n" +
                           $"Current Spend {spend}\n" +
                           $"{currentThres.Percentage}% exceeded\n\n\n" +
                           $"With Regards\n" +
                           $"Team ExpenseMate",
                           $"<h2>You have exeeded your budget</h2>" +
                           $"<p>{(b.Name == "Others" ? "Monthly Budget" : $"Categorical Budget for {b.Name}")} is Exceeded</p>" +
                           $"<p>Limit {b.Limit}</p>" +
                           $"<p>Current Spend {spend}</p>" + 
                           $"<p>{currentThres.Percentage}% exceeded</p><br/><br/>" +
                           $"<p>With Regards</p>" +
                           $"<p>Team ExpenseMate</p>"
                        );
                    }
                }
            }
        }
    }
}
