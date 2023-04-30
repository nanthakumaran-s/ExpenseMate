using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Expense_Tracker___Backend.Models
{
    public class InvoiceModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [ForeignKey("User")]
        public string? User { get; set; }

        [Required]
        public string? IncvoiceName { get; set; }

        [Required]
        public string? InvoiceURL { get; set; }

        [Required]
        public DateTime? CreatedDate { get; set; }
    }
}
