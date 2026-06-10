using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LedgerAi.Data;
using LedgerAi.Models;
using LedgerAi.DTOs;

namespace LedgerAi.Controllers
{
    [Authorize] // এই অ্যাট্রিবিউটের কারণে টোকেন ছাড়া এই কন্ট্রোলারে কেউ ঢুকতে পারবে না
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Accounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountDto>>> GetAccounts()
        {
            var accounts = await _context.Accounts
                .Select(a => new AccountDto
                {
                    Id = a.Id,
                    AccountName = a.AccountName,
                    AccountCode = a.AccountCode,
                    Type = a.Type.ToString() // Enum কে স্ট্রিংয়ে কনভার্ট করা হলো
                })
                .ToListAsync();

            return Ok(accounts);
        }

        // GET: api/Accounts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AccountDto>> GetAccount(int id)
        {
            var account = await _context.Accounts.FindAsync(id);

            if (account == null)
            {
                return NotFound();
            }

            var accountDto = new AccountDto
            {
                Id = account.Id,
                AccountName = account.AccountName,
                AccountCode = account.AccountCode,
                Type = account.Type.ToString()
            };

            return Ok(accountDto);
        }

        // POST: api/Accounts
        [HttpPost]
        public async Task<ActionResult<AccountDto>> PostAccount(AccountCreateDto dto)
        {
            // DTO থেকে Model-এ ডেটা ম্যাপ করা
            var account = new Account
            {
                AccountName = dto.AccountName,
                AccountCode = dto.AccountCode,
                Type = (AccountType)dto.Type
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            // সেভ হওয়ার পর নতুন ডেটা DTO হিসেবে রিটার্ন করা
            var accountDto = new AccountDto
            {
                Id = account.Id,
                AccountName = account.AccountName,
                AccountCode = account.AccountCode,
                Type = account.Type.ToString()
            };

            // 201 Created স্ট্যাটাস কোড রিটার্ন করবে এবং GetAccount মেথডের পাথ দিয়ে দেবে
            return CreatedAtAction(nameof(GetAccount), new { id = account.Id }, accountDto);
        }
    }
}