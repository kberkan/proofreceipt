create extension if not exists pgcrypto;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  merchant_name text not null,
  item_name text not null,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  status text not null default 'pending',
  payment_reference text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists receipts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  receipt_hash text not null,
  credential_json jsonb not null,
  refundable boolean not null default true,
  warranty_until timestamptz,
  refunded_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists refunds (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null references receipts(id) on delete cascade,
  status text not null default 'initiated',
  refund_reference text,
  created_at timestamptz not null default now()
);
