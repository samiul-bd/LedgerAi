namespace LedgerAi.DTOs
{
    public class AccountCreateDto
    {
        public string AccountName { get; set; } = string.Empty;
        public string AccountCode { get; set; } = string.Empty;
        public int Type { get; set; } // React থেকে Enum-এর ইন্টিজার ভ্যালু (১, ২, ৩...) আসবে
    }
}
