export type OrderStatus = "pending" | "paid" | "failed";

export interface Order {
  id: string;
  merchant_name: string;
  item_name: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  payment_reference?: string | null;
  created_at: string;
  paid_at?: string | null;
}

export interface Receipt {
  id: string;
  order_id: string;
  receipt_hash: string;
  credential_json: {
    merchantName: string;
    itemName: string;
    amount: number;
    currency: string;
    orderId: string;
    issuedAt: string;
    paymentReference: string;
    refundable: boolean;
    warrantyUntil: string | null;
  };
  refundable: boolean;
  warranty_until?: string | null;
  refunded_at?: string | null;
  created_at: string;
}
