using LedgerAi.Data;
using LedgerAi.DTOs;
using LedgerAi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LedgerAi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PurchasesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePurchaseTransaction([FromBody] PurchaseInvoiceCreateDTO dto)
        {
            // Database Transaction শুরু করা হচ্ছে
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                decimal totalAmount = dto.Quantity * dto.UnitRate;

                // ১. Financial Journal Entry তৈরি
                var journalEntry = new JournalEntry
                {
                    TransactionDate = DateTime.UtcNow,
                    Reference = dto.ReferenceNumber,
                    Description = "Inventory Purchase",
                    Lines = new List<JournalLine>
                    {
                        // Inventory A/C (Debit)
                        new JournalLine { AccountId = dto.InventoryAccountId, DebitAmount = totalAmount, CreditAmount = 0 },
                        // Accounts Payable / Supplier A/C (Credit)
                        new JournalLine { AccountId = dto.SupplierAccountId, DebitAmount = 0, CreditAmount = totalAmount }
                    }
                };
                _context.JournalEntries.Add(journalEntry);

                // ২. Store Ledger Entry (Stock IN) তৈরি
                var storeLedgerEntry = new StoreLedger
                {
                    ItemId = dto.ItemId,
                    TransactionType = "IN",
                    Quantity = dto.Quantity,
                    UnitRate = dto.UnitRate,
                    TotalValue = totalAmount,
                    TransactionDate = DateTime.UtcNow,
                    DocumentReference = dto.ReferenceNumber,
                    Remarks = "Purchased from Supplier"
                };
                _context.StoreLedgers.Add(storeLedgerEntry);

                // ডাটাবেসে সেভ করা
                await _context.SaveChangesAsync();

                // সব ঠিক থাকলে Transaction Commit করা
                await transaction.CommitAsync();

                return Ok(new { Message = "Purchase transaction recorded successfully in both Journal and Store Ledger." });
            }
            catch (Exception ex)
            {
                // কোনো এরর হলে পুরো প্রসেস বাতিল (Rollback) করে দেওয়া
                await transaction.RollbackAsync();
                return StatusCode(500, new { Message = "An error occurred during the transaction.", Error = ex.Message });
            }
        }
    }
}