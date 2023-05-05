using Expense_Tracker___Backend.Data;
using Expense_Tracker___Backend.Dto;
using Expense_Tracker___Backend.Helpers;
using Expense_Tracker___Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Expense_Tracker___Backend.Hangfire
{
    public class HangfireTestJobService : IHangfireTestJobService
    {
        private readonly ApplicationDbContext _dbContext;

        public HangfireTestJobService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddSubscriptions(string type)
        {
            var recurring = await _dbContext.Recurring.Where(r => r.Interval == type).ToListAsync();
            foreach (var recurringItem in recurring)
            {
                var user = await _dbContext.User.FindAsync(recurringItem.User);
                decimal closingBalance = 0;
                closingBalance = user!.Balance - recurringItem.Amount;
                TransactionModel transaction = new()
                {
                    User = recurringItem.User,
                    Amount = recurringItem.Amount,
                    Category = recurringItem.Category,
                    Date = DateTime.Now,
                    Note = recurringItem.Note,
                    Opening = user.Balance,
                    Closing = closingBalance,
                };
                user.Balance = closingBalance;
                _dbContext.Transaction.Add(transaction);
                _dbContext.User.Update(user);
                await _dbContext.SaveChangesAsync();
                await CheckBudget.Check(_dbContext, recurringItem.User!);
            }
            Console.WriteLine($"{DateTime.Now.ToString()} - Added Monthly Subscriptions to Transaction");
        }

        public async Task GenerateMonthlyInvoice() {
            var users = await _dbContext.User.ToListAsync();
            foreach(var u in users)
            {
                var invoices = await _dbContext.Invoice.Where(i => i.User == u.Email).ToListAsync();
                var user = _dbContext.User.FirstOrDefault(u => u.Email == u.Email);
                if (invoices.Count == 5 && user!.Subscription == "Free")
                {
                    continue;
                }
                DateTime now = DateTime.Now;
                var startDate = new DateTime(now.Year, now.Month, 1);
                var endDate = startDate.AddMonths(1).AddDays(-1);
                CustomTransactionDto cs = new()
                {
                    From = startDate,
                    To = endDate
                };
                await GenerateInvoiceHelper.Generate(_dbContext, u.Email!, cs);
            }
            Console.WriteLine($"{DateTime.Now.ToString()} - Generated Monthly Invoice");
        }

        public async Task ResetThreshold()
        {
            var thresholds = await _dbContext.Threshold.ToListAsync();
            foreach(ThresholdModel threshold in thresholds)
            {
                threshold.Status = "Active";
                _dbContext.Threshold.Update(threshold);
            }
            await _dbContext.SaveChangesAsync();
            Console.WriteLine($"{DateTime.Now.ToString()} - Reset Threshold");
        }
    }
}
