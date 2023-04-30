namespace Expense_Tracker___Backend.Dto
{
    public class AddTransactionDto
    {
        public int Category { get; set; }
        public decimal Amount { get; set; }
        public string? Note { get; set; }
        public DateTime Date { get; set; }
    }
}
