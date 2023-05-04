namespace Expense_Tracker___Backend.Dto
{
    public class AddBudgetDto
    {
        public int Category { get; set; }
        public decimal Limit { get; set; }
    }

    public class AddThresholdDto
    {
        public int BudgetId { get; set; }
        public int Percentage { get; set; }
    }
}
