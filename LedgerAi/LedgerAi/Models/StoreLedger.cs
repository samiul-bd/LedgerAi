using System;

namespace LedgerAi.Models
{
    public class StoreLedger
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public Item? Item { get; set; }
        public DateTime TransactionDate { get; set; }
        public string TransactionType { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitRate { get; set; }
        public decimal TotalValue { get; set; }
        public string DocumentReference { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
    }
}