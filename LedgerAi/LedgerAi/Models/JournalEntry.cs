using System.ComponentModel.DataAnnotations;

namespace LedgerAi.Models
{
    public class JournalEntry
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; } = DateTime.Now;

        [Required]
        public string Narration { get; set; } = string.Empty;

        // Navigation Property
        public List<JournalLine> JournalLines { get; set; } = new();
    }
}
