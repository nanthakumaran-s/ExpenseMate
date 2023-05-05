using Expense_Tracker___Backend.Data;
using Expense_Tracker___Backend.Hangfire;
using Expense_Tracker___Backend.Middleware;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Stripe;

namespace Expense_Tracker___Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<ApplicationDbContext>(options => 
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("dB")    
                )
            );

            builder.Services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET")!)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                };
            });

            builder.Services.AddHangfire(x => x.UseSqlServerStorage(builder.Configuration.GetConnectionString("dB")));
            builder.Services.AddHangfireServer();
            builder.Services.AddScoped<IHangfireTestJobService, HangfireTestJobService>();

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            StripeConfiguration.ApiKey = "sk_test_51N4HMZSGBongFGBv5RQvODvG28CgMt71xphDIJB5bDNhAw0x4am4iVQQAjX3GPHiTobChncLc6ZC6ovrCNp3XtXQ00zHavJ2Bh";

            app.UseHttpsRedirection();
            app.UseMiddleware<JWTMiddleware>();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCors(options =>
                options.WithOrigins("*")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
            );
            app.UseHangfireDashboard();



            app.MapControllers();

            app.Run();
        }
    }
}