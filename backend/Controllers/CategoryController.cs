using Expense_Tracker___Backend.Data;
using Expense_Tracker___Backend.Dto;
using Expense_Tracker___Backend.Models;
using Expense_Tracker___Backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Expense_Tracker___Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public CategoryController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _dbContext.Category.ToListAsync();
                return Ok(new
                {
                    status = true,
                    categories
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    status = false,
                    message = "Some error occured"
                });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddCategory([FromForm] AddCategoryDto categoryDto)
        {
            try
            {
                CategoryModel category = new()
                {
                    Name = categoryDto.Name,
                    Type = categoryDto.Type
                };
                _dbContext.Add(category);
                await _dbContext.SaveChangesAsync();
                return Ok(new
                {
                    status = true,
                    
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    status = false,
                    message = "Some error occured"
                });
            }
        }
    }
}
