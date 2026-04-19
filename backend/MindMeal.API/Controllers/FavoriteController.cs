using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindMeal.API.Data;
using MindMeal.API.Models;
using Microsoft.AspNetCore.Authorization;


namespace MindMeal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly AppDbContext _context;
        public FavoriteController(AppDbContext context) => _context = context;

        [HttpPost("{recipeId}")]
        [Authorize]
        public async Task<IActionResult> ToggleFavorite(int recipeId)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);

            var existingFavorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.RecipeId == recipeId);

            if (existingFavorite != null)
            {
                _context.Favorites.Remove(existingFavorite);
                await _context.SaveChangesAsync();
                return Ok(new { isFavorite = false });
            }

            _context.Favorites.Add(new Favorite { UserId = userId, RecipeId = recipeId });
            await _context.SaveChangesAsync();
            return Ok(new { isFavorite = true });
        }
    }
}