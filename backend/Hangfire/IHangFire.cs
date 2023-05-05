using Expense_Tracker___Backend.Data;

namespace Expense_Tracker___Backend.Hangfire
{
    public interface IHangfireTestJobService
    {
        Task AddSubscriptions(string type);
        Task GenerateMonthlyInvoice();
    }
}
