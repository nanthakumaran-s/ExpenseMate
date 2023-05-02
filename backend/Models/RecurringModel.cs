using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Expense_Tracker___Backend.Models
{
    public class RecurringModel
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
        public string? Interval { get; set; }
        
        [Required]
        public string? Status { get; set; }
    }
}
