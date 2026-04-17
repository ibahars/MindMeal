using Microsoft.AspNetCore.Mvc;
using MindMeal.API.Data;
using MindMeal.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;

namespace MindMeal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        // IConfiguration'ı buradan içeri alıyoruz (Inject ediyoruz)
        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto request)
        {
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = passwordHash,
                CreatedAt = DateTime.Now
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User created!" });
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest("Wrong email or password.");
            }

            var newRefreshToken = GenerateRefreshToken();
            user.RefreshToken = newRefreshToken.Token;
            user.TokenCreated = newRefreshToken.Created;
            user.TokenExpires = newRefreshToken.Expires;

            await _context.SaveChangesAsync();

            var response = new AuthResponseDto
            {
                Token = CreateToken(user),
                RefreshToken = user.RefreshToken,
                Username = user.Username,
                Email = user.Email
            };
            return Ok(response);
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<string>> RefreshToken(TokenRequestDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);

            if (user == null || user.TokenExpires < DateTime.Now)
            {
                return Unauthorized("Geçersiz veya süresi dolmuş Refresh Token.");
            }

            string newToken = CreateToken(user);
            return Ok(newToken);
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private RefreshToken GenerateRefreshToken()
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.Now.AddMinutes(15),
                Created = DateTime.Now
            };

            return refreshToken;
        }
    }

    internal class RefreshToken
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expires { get; internal set; }
        public DateTime Created { get; internal set; }
    }
}