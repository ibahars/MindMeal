using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindMeal.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCaloriesToRecipe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Calories",
                table: "Recipes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Calories",
                table: "Recipes");
        }
    }
}
