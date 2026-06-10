using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LedgerAi.Models
{
    public class JournalLine
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int JournalEntryId { get; set; }
        [ForeignKey("JournalEntryId")]
        public JournalEntry? JournalEntry { get; set; }

        [Required]
        public int AccountId { get; set; }
        [ForeignKey("AccountId")]
        public Account? Account { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Debit { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Credit { get; set; }
    }
}
