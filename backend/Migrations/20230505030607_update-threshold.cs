using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Expense_Tracker___Backend.Migrations
{
    /// <inheritdoc />
    public partial class updatethreshold : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Threshold",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Threshold");
        }
    }
}
