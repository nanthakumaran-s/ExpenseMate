using Expense_Tracker___Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Expense_Tracker___Backend.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<UserModel> User { get; set; }
        public DbSet<TransactionModel> Transaction { get; set; }
        public DbSet<CategoryModel> Category { get; set; }
        public DbSet<BudgetModel> Budget { get; set; }
        public DbSet <ThresholdModel> Threshold { get; set; }
        public DbSet<RecurringModel> Recurring { get; set; }
    }
}
