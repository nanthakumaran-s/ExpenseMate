using System.ComponentModel.DataAnnotations;

namespace Expense_Tracker___Backend.Models
{
    public class UserModel
    {
        [Key]
        [Required]
        public string? Email { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public string? Password { get; set; }

        [Required]
        public string? Avatar { get; set; }

        [Required]
        public decimal Balance { get; set; }
    }
}
