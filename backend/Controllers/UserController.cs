using Expense_Tracker___Backend.Data;
using Expense_Tracker___Backend.Dto;
using Expense_Tracker___Backend.Handler;
using Expense_Tracker___Backend.Models;
using Expense_Tracker___Backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using System.IdentityModel.Tokens.Jwt;

namespace Expense_Tracker___Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public UserController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                string email = JWTUtil.GetValue(HttpContext);
                var user = await _dbContext.User.FindAsync(email);

                if (user == null)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "No user found"
                    });
                }

                return Ok(new
                {
                    status = true,
                    user
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    status = false,
                    message = "Some error occured"
                });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] UserRegisterDto newUser)
        {
            try
            {
                if (_dbContext.User.Any(u => u.Email == newUser.Email))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "User already exist"
                    });
                }
                UserModel user = new()
                {
                    Email = newUser.Email,
                    Name = newUser.Name,
                    Password = BCryptUtil.HashPassword(newUser.Password),
                    Avatar = newUser.Avatar,
                    Balance = 0,
                    Subscription = "Free"
                };
                _dbContext.Add(user);
                await _dbContext.SaveChangesAsync();

                var token = JWTUtil.GenerateToken(newUser.Email);
                return Ok(new
                {
                    status = true,
                    token
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    status = false,
                    message = "Some error occured"
                });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] UserLoginDto user)
        {
            try
            {
                var dbUser = await _dbContext.User.FindAsync(user.Email);
                if (dbUser == null)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "No user found"
                    });
                }

                if (!BCryptUtil.VerifyPassword(user.Password, dbUser.Password!))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Password not matched"
                    });
                }

                var token = JWTUtil.GenerateToken(user.Email);
                return Ok(new
                {
                    status = true,
                    user = dbUser,
                    token,
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    status = false,
                    message = "Some error occured"
                });
            }
        }

        [HttpPost("reset-request")]
        public IActionResult ResetPassRequest()
        {
            try
            {
                string resetToken = Guid.NewGuid().ToString("N").Substring(0, 4);
                RedisHandler redisHandler = new();
                redisHandler.SetToken(resetToken, Request.Form["Email"]!);
                MailHandler.SendMail(
                   "Reset password Request",
                   Request.Form["Email"]!,
                   Request.Form["Email"]!,
                   $"The OTP is {resetToken}"
                );
                return Ok(new
                {
                    status = true,
                    message = "Initiated reset password request"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    status = false,
                    message = "Some error occured"
                });
            }

        }

        [HttpPost("reset-pass")]
        public async Task<IActionResult> ResetPass([FromForm] ResetPasswordDto resetPassword)
        {
            try
            {
                RedisHandler redisHandler = new();
                string token = redisHandler.GetToken(resetPassword.Email);
                if (token == null || token != resetPassword.Token)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "The token is either null or wrong"
                    });
                }
                var user = _dbContext.User.FirstOrDefault(u => u.Email == resetPassword.Email);
                if (user == null)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "No user found"
                    });
                }
                user.Password = BCryptUtil.HashPassword(resetPassword.Password);
                await _dbContext.SaveChangesAsync();
                redisHandler.DeleteToken(resetPassword.Email);
                return Ok(new
                {
                    status = true,
                    message = "Password Reset successful"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    status = false,
                    message = "Some error occured"
                });
            }

        }

        [Authorize]
        [HttpPost("change-pass")]
        public async Task<IActionResult> ChangePassword()
        {
            try
            {
                string email = JWTUtil.GetValue(HttpContext);
                var user = _dbContext.User.FirstOrDefault(u => u.Email == email);
                user!.Password = BCryptUtil.HashPassword(Request.Form["Password"].ToString());
                await _dbContext.SaveChangesAsync();
                return Ok(new
                {
                    status = true,
                    message = "Password changed successful"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    status = false,
                    message = "Some error occured"
                });
            }
        }

        [HttpGet("checkout")]
        [Authorize]
        public async Task<IActionResult> Checkout()
        {
            var domain = "http://localhost:3000";
            var options = new SessionCreateOptions
            {
                LineItems = new List<SessionLineItemOptions>
                {
                  new SessionLineItemOptions
                  {
                    Price = "price_1N4HhVSGBongFGBvXcsxWEM3",
                    Quantity = 1,
                  },
                },
                Mode = "payment",
                SuccessUrl = domain + "?payment=true",
                CancelUrl = domain + "?payment=false",
            };
            var service = new SessionService();
            Session session = service.Create(options);

            return Ok(new
            {
                link = session.Url
            });
        }

        [HttpPatch("upgrade")]
        [Authorize]
        public async Task<IActionResult> Upgrade()
        {
            try
            {
                var email = JWTUtil.GetValue(HttpContext);
                var user = _dbContext.User.FirstOrDefault(u => u.Email == email);
                if (user.Subscription == "Pro")
                {
                    return Ok();
                }
                user.Subscription = "Pro";
                _dbContext.User.Update(user);
                RecurringModel model = new()
                {
                    Note = "Expense Mate",
                    Amount = 150,
                    User = email,
                    Interval = "Monthly",
                    Category = 6,
                    Status = "Active"
                };
                _dbContext.Recurring.Add(model);
                await _dbContext.SaveChangesAsync();
                return Ok(new
                {
                    status= true,
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    status = false,
                    message = "Some error occured"
                });
            }
        }
    }
}
