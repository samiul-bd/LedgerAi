namespace LedgerAi.DTOs
{
    public class PurchaseInvoiceCreateDTO
    {
        // For Store Ledger
        public int ItemId { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitRate { get; set; }

        // For Financial Journal
        public int SupplierAccountId { get; set; } // Accounts Payable (Credit)
        public int InventoryAccountId { get; set; } // Inventory Asset (Debit)

        public string ReferenceNumber { get; set; } = string.Empty; // Invoice No.
    }
}