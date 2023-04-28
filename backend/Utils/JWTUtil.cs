using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Expense_Tracker___Backend.Utils
{
    public class JWTUtil
    {
        private static string SecretKey = Environment.GetEnvironmentVariable("JWT_SECRET")!;
        private static readonly byte[] SecretKeyBytes = Encoding.ASCII.GetBytes(SecretKey);

        public static string GenerateToken(string email)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, email)
            };
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(365),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(SecretKeyBytes), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static string GetValue(HttpContext context)
        {
            var claims = context.Items["jwt"] as ClaimsPrincipal;
            return claims!.Claims.First().Value;
        }
    }
}
