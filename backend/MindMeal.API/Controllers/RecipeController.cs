using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindMeal.API.Data;

namespace MindMeal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RecipeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetRecipes()
        {
            return await _context.Recipes.ToListAsync();
        }
    }
}