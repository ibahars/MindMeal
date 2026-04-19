using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindMeal.API.Data;
using MindMeal.API.Models;
using System.Security.Claims;

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
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            int currentUserId = userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;

            var recipes = await _context.Recipes
                .Select(r => new
                {
                    r.Id,
                    r.Title,
                    r.Description,
                    r.PrepTime,
                    r.Difficulty,
                    r.Calories,
                    r.CreatedAt,
                    r.UserId,
                    IsFavorite = currentUserId != 0 && _context.Favorites.Any(f => f.RecipeId == r.Id && f.UserId == currentUserId)
                })
                .ToListAsync();

            return Ok(recipes);
        }

        [HttpGet("my-recipes")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetMyRecipes()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var myRecipes = await _context.Recipes
                .Where(r => r.UserId == userId)
                .Select(r => new
                {
                    r.Id,
                    r.Title,
                    r.Description,
                    r.PrepTime,
                    r.Difficulty,
                    r.Calories,
                    r.CreatedAt,
                    r.UserId,
                    IsFavorite = _context.Favorites.Any(f => f.RecipeId == r.Id && f.UserId == userId)
                })
                .ToListAsync();

            return Ok(myRecipes);
        }

        [HttpGet("favorites")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetFavoriteRecipes()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var favoriteRecipes = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Recipe)
                .Select(f => new
                {
                    f.Recipe!.Id,
                    f.Recipe.Title,
                    f.Recipe.Description,
                    f.Recipe.PrepTime,
                    f.Recipe.Difficulty,
                    f.Recipe.Calories,
                    f.Recipe.CreatedAt,
                    f.Recipe.UserId,
                    IsFavorite = true
                })
                .ToListAsync();

            return Ok(favoriteRecipes);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Recipe>> CreateRecipe(Recipe recipe)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            recipe.UserId = userId;
            recipe.CreatedAt = DateTime.Now;

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();
            return Ok(recipe);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateRecipe(int id, Recipe recipe)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var existingRecipe = await _context.Recipes.FindAsync(id);

            if (existingRecipe == null) return NotFound();
            if (existingRecipe.UserId != userId) return Forbid();

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
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null) return NotFound();
            if (recipe.UserId != userId) return Forbid();

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}