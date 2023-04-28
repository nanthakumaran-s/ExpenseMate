using System.ComponentModel.DataAnnotations;

namespace Expense_Tracker___Backend.Models
{
    public enum CategoryTypeEnum
    {
        Income,
        Expense
    }

    public class CategoryModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public string? Icon { get; set; }

        [Required]
        public CategoryTypeEnum Type { get; set; }
    }
}
