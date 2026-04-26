using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindMeal.API.Data;
using MindMeal.API.Models;
using System.Security.Claims;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System.Text.Json;

namespace MindMeal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly Cloudinary _cloudinary;

        public RecipeController(AppDbContext context)
        {
            _context = context;

            var account = new Account(
                Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME"),
                Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY"),
                Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET")
            );
            _cloudinary = new Cloudinary(account);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetRecipes()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            int currentUserId = userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;

            return Ok(await _context.Recipes.Include(r => r.Instructions).Select(r => new
            {
                r.Id,
                r.Title,
                r.Description,
                r.ImageUrl,
                r.PrepTime,
                r.Difficulty,
                r.Calories,
                r.Category,
                r.CreatedAt,
                r.UserId,
                Instructions = r.Instructions.Select(i => new
                {
                    i.Id,
                    i.StepNumber,
                    i.Action
                }).OrderBy(i => i.StepNumber).ToList(),
                IsFavorite = currentUserId != 0 && _context.Favorites.Any(f => f.RecipeId == r.Id && f.UserId == currentUserId)
            }).ToListAsync());
        }

        [HttpGet("my-recipes")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetMyRecipes()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            return Ok(await _context.Recipes.Where(r => r.UserId == userId).Include(r => r.Instructions).Select(r => new
            {
                r.Id,
                r.Title,
                r.Description,
                r.ImageUrl,
                r.PrepTime,
                r.Difficulty,
                r.Calories,
                r.Category,
                r.CreatedAt,
                r.UserId,
                Instructions = r.Instructions.Select(i => new
                {
                    i.Id,
                    i.StepNumber,
                    i.Action
                }).OrderBy(i => i.StepNumber).ToList(),
                IsFavorite = _context.Favorites.Any(f => f.RecipeId == r.Id && f.UserId == userId),

            }).ToListAsync());
        }

        [HttpGet("favorites")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetFavoriteRecipes()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim.Value);

            return Ok(await _context.Favorites.Where(f => f.UserId == userId).Include(f => f.Recipe).Select(f => new
            {
                f.Recipe!.Id,
                f.Recipe.Title,
                f.Recipe.Description,
                f.Recipe.ImageUrl,
                f.Recipe.PrepTime,
                f.Recipe.Difficulty,
                f.Recipe.Calories,
                f.Recipe.Category,
                f.Recipe.CreatedAt,
                f.Recipe.UserId,
                IsFavorite = true
            }).ToListAsync());
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Recipe>> CreateRecipe(
            [FromForm] string title,
            [FromForm] string description,
            [FromForm] int prepTime,
            [FromForm] int calories,
            [FromForm] string category,
            [FromForm] string difficulty,
            [FromForm] string instructionsJson,
            IFormFile? imageFile)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var recipe = new Recipe
            {
                Title = title,
                Description = description,
                PrepTime = prepTime,
                Calories = calories,
                Category = category,
                Difficulty = difficulty,
                UserId = userId,
                CreatedAt = DateTime.Now
            };

            if (!string.IsNullOrEmpty(instructionsJson))
            {
                var steps = JsonSerializer.Deserialize<List<string>>(instructionsJson);
                if (steps != null)
                {
                    recipe.Instructions = steps.Select((s, index) => new Instruction
                    {
                        StepNumber = index + 1,
                        Action = s
                    }).ToList();
                }
            }

            if (imageFile != null && imageFile.Length > 0)
            {
                recipe.ImageUrl = await UploadToCloudinary(imageFile);
            }

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Tarif başarıyla oluşturuldu", recipeId = recipe.Id });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateRecipe(
        int id,
        [FromForm] string title,
        [FromForm] string description,
        [FromForm] int prepTime,
        [FromForm] int calories,
        [FromForm] string category,
        [FromForm] string difficulty,
        [FromForm] string instructionsJson,
        IFormFile? imageFile)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var existingRecipe = await _context.Recipes.Include(r => r.Instructions).FirstOrDefaultAsync(r => r.Id == id);

            if (existingRecipe == null) return NotFound();
            if (existingRecipe.UserId != userId) return Forbid();

            existingRecipe.Title = title;
            existingRecipe.Description = description;
            existingRecipe.PrepTime = prepTime;
            existingRecipe.Calories = calories;
            existingRecipe.Category = category;
            existingRecipe.Difficulty = difficulty;

            _context.Instructions.RemoveRange(existingRecipe.Instructions);

            if (!string.IsNullOrEmpty(instructionsJson))
            {
                var steps = JsonSerializer.Deserialize<List<string>>(instructionsJson);
                if (steps != null)
                {
                    existingRecipe.Instructions = steps.Select((s, index) => new Instruction
                    {
                        StepNumber = index + 1,
                        Action = s
                    }).ToList();
                }
            }

            if (imageFile != null) existingRecipe.ImageUrl = await UploadToCloudinary(imageFile);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Tarif başarıyla güncellendi" });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var recipe = await _context.Recipes.FindAsync(id);
            if (recipe == null || recipe.UserId != userId) return NotFound();
            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
            return Ok();
        }

        private async Task<string> UploadToCloudinary(IFormFile file)
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Transformation = new Transformation().Crop("fill").Width(800).Height(600)
            };
            var result = await _cloudinary.UploadAsync(uploadParams);
            return result.SecureUrl.ToString();
        }
    }
}