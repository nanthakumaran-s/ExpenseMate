using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Expense_Tracker___Backend.Models
{
    public class TransactionModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [ForeignKey("User")]
        public string? User { get; set; }

        [ForeignKey("Category")]
        public int Category { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string? Note { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public decimal Opening { get; set; }

        [Required]
        public decimal Closing { get; set; }
    }
}
