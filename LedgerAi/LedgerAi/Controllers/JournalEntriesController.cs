using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LedgerAi.Data;
using LedgerAi.Models;
using LedgerAi.DTOs;

namespace LedgerAi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class JournalEntriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JournalEntriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/JournalEntries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JournalEntryDto>>> GetJournalEntries()
        {
            var entries = await _context.JournalEntries
                .Include(j => j.JournalLines)
                .ThenInclude(l => l.Account) // Account এর নাম পাওয়ার জন্য
                .OrderByDescending(j => j.Date)
                .Select(j => new JournalEntryDto
                {
                    Id = j.Id,
                    Date = j.Date,
                    Narration = j.Narration,
                    Lines = j.JournalLines.Select(l => new JournalLineDto
                    {
                        Id = l.Id,
                        AccountId = l.AccountId,
                        AccountName = l.Account!.AccountName,
                        Debit = l.Debit,
                        Credit = l.Credit
                    }).ToList()
                })
                .ToListAsync();

            return Ok(entries);
        }

        // POST: api/JournalEntries
        [HttpPost]
        public async Task<ActionResult<JournalEntryDto>> PostJournalEntry(JournalEntryCreateDto dto)
        {
            // ১. বেসিক ভ্যালিডেশন: কমপক্ষে দুটি লাইন থাকতে হবে
            if (dto.Lines == null || dto.Lines.Count < 2)
            {
                return BadRequest("A journal entry must have at least two lines (Debit and Credit).");
            }

            // ২. ডাবল-এন্ট্রি ভ্যালিডেশন: মোট ডেবিট এবং মোট ক্রেডিট সমান হতে হবে
            decimal totalDebit = dto.Lines.Sum(l => l.Debit);
            decimal totalCredit = dto.Lines.Sum(l => l.Credit);

            if (totalDebit != totalCredit)
            {
                return BadRequest($"Debit and Credit amounts are not equal. Total Debit: {totalDebit}, Total Credit: {totalCredit}");
            }

            // ৩. ডেটাবেসে ম্যাপ করা
            var entry = new JournalEntry
            {
                Date = dto.Date,
                Narration = dto.Narration,
                JournalLines = dto.Lines.Select(l => new JournalLine
                {
                    AccountId = l.AccountId,
                    Debit = l.Debit,
                    Credit = l.Credit
                }).ToList()
            };

            // EF Core স্বয়ংক্রিয়ভাবে Parent এবং Child (Lines) একসাথেই ডাটাবেসে সেভ করবে
            _context.JournalEntries.Add(entry);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Journal entry saved successfully.", JournalId = entry.Id });
        }
    }
}