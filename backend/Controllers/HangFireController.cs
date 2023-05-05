using Expense_Tracker___Backend.Data;
using Expense_Tracker___Backend.Hangfire;
using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Expense_Tracker___Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HangfireTestJobController : ControllerBase
    {
        private readonly IHangfireTestJobService _hangfireTestService;
        private readonly IBackgroundJobClient _backgroundJobClient;
        private readonly IRecurringJobManager _recurringJobManager;
        private readonly ApplicationDbContext _dbContext;

        public HangfireTestJobController(IHangfireTestJobService hangfireTestService, IBackgroundJobClient backgroundJobClient, IRecurringJobManager recurringJobManager, ApplicationDbContext dbContext)
        {
            _hangfireTestService = hangfireTestService;
            _backgroundJobClient = backgroundJobClient;
            _recurringJobManager = recurringJobManager;
            _dbContext = dbContext;
        }

        [HttpGet("/monthly")]
        public ActionResult Monthly()
        {
            _recurringJobManager.AddOrUpdate("AddSubscription", () => _hangfireTestService.AddSubscriptions( "Monthly"), Cron.Monthly);
            return Ok();
        }

        [HttpGet("/yearly")]
        public ActionResult Yearly()
        {
            _recurringJobManager.AddOrUpdate("AddSubscriptionYearly", () => _hangfireTestService.AddSubscriptions("Yearly"), Cron.Yearly);
            return Ok();
        }

        [HttpGet("/invoice")]
        public ActionResult Invoice()
        {
            _recurringJobManager.AddOrUpdate("GenerateMonthlyInvoice", () => _hangfireTestService.GenerateMonthlyInvoice(), Cron.Monthly);
            return Ok();
        }
    }
}
