namespace LedgerAi.DTOs
{
    public class AccountDto
    {
        public int Id { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public string AccountCode { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // React-এ Enum-এর টেক্সট ভার্সন দেখানোর জন্য
    }
}
