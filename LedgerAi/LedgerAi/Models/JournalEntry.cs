using System;
using System.Collections.Generic;

namespace LedgerAi.Models
{
    public class JournalEntry
    {
        public int Id { get; set; }
        public DateTime TransactionDate { get; set; }
        public string Reference { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Navigation property for 1-to-Many relationship
        public ICollection<JournalLine> Lines { get; set; } = new List<JournalLine>();
    }
}