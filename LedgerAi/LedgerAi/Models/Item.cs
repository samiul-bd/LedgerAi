using System.Collections.Generic;

namespace LedgerAi.Models
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public string UnitOfMeasure { get; set; } = string.Empty;

        public ICollection<StoreLedger> StoreLedgers { get; set; } = new List<StoreLedger>();
    }
}