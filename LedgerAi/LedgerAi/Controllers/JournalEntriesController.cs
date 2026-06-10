using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LedgerAi.Data;
using LedgerAi.Models;
using LedgerAi.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
                .Include(j => j.Lines) // Changed from JournalLines to Lines
                .ThenInclude(l => l.Account)
                .OrderByDescending(j => j.TransactionDate) // Changed from Date to TransactionDate
                .Select(j => new JournalEntryDto
                {
                    Id = j.Id,
                    Date = j.TransactionDate, // Mapping DB TransactionDate to DTO Date
                    Narration = j.Description, // Mapping DB Description to DTO Narration
                    Lines = j.Lines.Select(l => new JournalLineDto
                    {
                        Id = l.Id,
                        AccountId = l.AccountId,
                        AccountName = l.Account!.AccountName,
                        Debit = l.DebitAmount, // Mapping DB DebitAmount to DTO Debit
                        Credit = l.CreditAmount // Mapping DB CreditAmount to DTO Credit
                    }).ToList()
                })
                .ToListAsync();

            return Ok(entries);
        }

        // POST: api/JournalEntries
        [HttpPost]
        public async Task<ActionResult<JournalEntryDto>> PostJournalEntry(JournalEntryCreateDto dto)
        {
            // ১. বেসিক ভ্যালিডেশন
            if (dto.Lines == null || dto.Lines.Count < 2)
            {
                return BadRequest("A journal entry must have at least two lines (Debit and Credit).");
            }

            // ২. ডাবল-এন্ট্রি ভ্যালিডেশন
            decimal totalDebit = dto.Lines.Sum(l => l.Debit);
            decimal totalCredit = dto.Lines.Sum(l => l.Credit);

            if (totalDebit != totalCredit)
            {
                return BadRequest($"Debit and Credit amounts are not equal. Total Debit: {totalDebit}, Total Credit: {totalCredit}");
            }

            // ৩. ডেটাবেসে ম্যাপ করা (DTO থেকে Model-এ)
            var entry = new JournalEntry
            {
                TransactionDate = dto.Date, // Mapping DTO Date to DB TransactionDate
                Description = dto.Narration, // Mapping DTO Narration to DB Description
                Lines = dto.Lines.Select(l => new JournalLine
                {
                    AccountId = l.AccountId,
                    DebitAmount = l.Debit, // Mapping DTO Debit to DB DebitAmount
                    CreditAmount = l.Credit // Mapping DTO Credit to DB CreditAmount
                }).ToList()
            };

            _context.JournalEntries.Add(entry);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Journal entry saved successfully.", JournalId = entry.Id });
        }
    }
}