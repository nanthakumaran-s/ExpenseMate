using StackExchange.Redis;

namespace Expense_Tracker___Backend.Handler
{
    public class RedisHandler
    {
        private readonly ConnectionMultiplexer _connectionMultiplexer;
        private readonly IDatabase _database;

        public RedisHandler()
        {
            _connectionMultiplexer = ConnectionMultiplexer.Connect("localhost");
            _database = _connectionMultiplexer.GetDatabase();
        }

        public void SetToken(string token, string email)
        {
            _database.StringSet(email, token, TimeSpan.FromMinutes(10));
        }

        public string GetToken(string email)
        {
            return _database.StringGet(email).ToString();
        }

        public void DeleteToken(string email)
        {
            _database.KeyDelete(email);
        }
    }
}
