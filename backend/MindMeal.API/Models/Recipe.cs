namespace MindMeal.API.Models
{
    public class Recipe
    {

        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Instructions { get; set; }
        public string? ImageUrl { get; set; }
        public int PrepTime { get; set; }
        public string Difficulty { get; set; } = "Kolay";
        public int Calories { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int UserId { get; set; }
        public User? User { get; set; }

    }
}