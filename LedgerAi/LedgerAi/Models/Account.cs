using System.ComponentModel.DataAnnotations;

namespace LedgerAi.Models
{
    public class Account
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string AccountName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string AccountCode { get; set; } = string.Empty;

        [Required]
        public AccountType Type { get; set; }
    }
}
