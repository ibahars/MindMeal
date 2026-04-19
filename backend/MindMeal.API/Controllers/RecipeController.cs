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

        [HttpGet("my-recipes")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetMyRecipes()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

            var myRecipes = await _context.Recipes
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(myRecipes);
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

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateRecipe(int id, Recipe recipe)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            var existingRecipe = await _context.Recipes.FindAsync(id);

            if (existingRecipe == null) return NotFound();
            if (existingRecipe.UserId != userId) return Forbid(); // Başkasının tarifini düzenleyemez!

            existingRecipe.Title = recipe.Title;
            existingRecipe.Description = recipe.Description;
            existingRecipe.PrepTime = recipe.PrepTime;
            existingRecipe.Difficulty = recipe.Difficulty;
            existingRecipe.Calories = recipe.Calories;

            await _context.SaveChangesAsync();
            return Ok(existingRecipe);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null) return NotFound();
            if (recipe.UserId != userId) return Forbid();

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }


}