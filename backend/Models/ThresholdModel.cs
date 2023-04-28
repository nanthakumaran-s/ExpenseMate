using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Expense_Tracker___Backend.Models
{
    public class ThresholdModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [ForeignKey("Budget")]
        public int Budget { get; set; }

        [Required]
        public int Percentage { get; set; }
    }
}
