using Microsoft.EntityFrameworkCore;
using MindMeal.API.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Veritabanı Bağlantısını Tanımlıyoruz
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

// Swagger (API Test Ekranı) ayarları
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 2. Uygulama çalışırken hangi özellikleri kullanacak?
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();