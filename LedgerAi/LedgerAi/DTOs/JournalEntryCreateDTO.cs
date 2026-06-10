namespace LedgerAi.DTOs
{
    public class JournalEntryCreateDto
    {
        public DateTime Date { get; set; }
        public string Narration { get; set; } = string.Empty;
        public List<JournalLineCreateDto> Lines { get; set; } = new();
    }

    public class JournalLineCreateDto
    {
        public int AccountId { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
    }

    // ডাটাবেস থেকে React-এ ডেটা দেখানোর জন্য
    public class JournalEntryDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Narration { get; set; } = string.Empty;
        public List<JournalLineDto> Lines { get; set; } = new();
    }

    public class JournalLineDto
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
    }
}
