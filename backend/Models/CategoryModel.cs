using System.ComponentModel.DataAnnotations;

namespace Expense_Tracker___Backend.Models
{
    public class CategoryModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public string? Type { get; set; }
    }
}
