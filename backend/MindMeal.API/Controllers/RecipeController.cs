using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindMeal.API.Data;
using MindMeal.API.Models;

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

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Recipe>> CreateRecipe(Recipe recipe)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized("Kullanıcı bilgisi alınamadı.");
            }

            recipe.UserId = int.Parse(userIdClaim.Value);
            recipe.CreatedAt = DateTime.Now;

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return Ok(recipe);

        }
    }


}