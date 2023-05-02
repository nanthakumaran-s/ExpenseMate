namespace Expense_Tracker___Backend.Dto
{
    public class AddSubscriptionDto
    {
        public string? Note { get; set; }
        public int Category { get; set; }
        public decimal Amount { get; set; }
        public string? Interval { get; set; }
    }

    public class UpdateSubscriptionDto
    {
        public int Id { get; set; }
        public string? Status { get; set; }
    }
}
