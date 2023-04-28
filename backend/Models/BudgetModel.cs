﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Expense_Tracker___Backend.Models
{
    public enum BudgetTypeEnum
    {
        Monthly,
        Once
    }

    public class BudgetModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [ForeignKey("User")]
        public string? User { get; set; }

        [ForeignKey("Category")]
        public int Category { get; set; }

        [Required]
        public BudgetTypeEnum Type { get; set; }

        [Required]
        public decimal Limit { get; set; }

    }
}
