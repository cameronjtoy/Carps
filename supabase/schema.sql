-- Carps schema: run in the Supabase SQL editor once the project exists.
-- Mirrors src/types.ts so src/api/index.ts can switch from mock data to Supabase.

create table categories (
  id text primary key,                -- e.g. 'oil-filter'
  name text not null,
  description text,
  icon text,
  spec_columns jsonb not null default '[]'  -- [{ "key": "media", "label": "Media" }]
);

create table vehicles (
  id text primary key default gen_random_uuid()::text,
  year int not null,
  make text not null,
  model text not null,
  engine text not null,
  unique (year, make, model, engine)
);

create table parts (
  id text primary key default gen_random_uuid()::text,
  category_id text not null references categories(id),
  brand text not null,
  name text not null,
  part_number text not null,
  specs jsonb not null default '{}',
  image_url text,
  rating numeric(2,1),
  review_count int default 0,
  unique (brand, part_number)
);

create table fitments (
  part_id text references parts(id) on delete cascade,
  vehicle_id text references vehicles(id) on delete cascade,
  primary key (part_id, vehicle_id)
);

create table retailers (
  id text primary key,
  name text not null,
  url text not null,
  shipping_note text
);

-- Current price per (part, retailer). Keep history in price_history for charts/alerts.
create table prices (
  part_id text references parts(id) on delete cascade,
  retailer_id text references retailers(id) on delete cascade,
  price numeric(10,2) not null,
  in_stock boolean not null default true,
  url text not null,
  updated_at timestamptz not null default now(),
  primary key (part_id, retailer_id)
);

create table price_history (
  id bigint generated always as identity primary key,
  part_id text references parts(id) on delete cascade,
  retailer_id text references retailers(id) on delete cascade,
  price numeric(10,2) not null,
  in_stock boolean not null,
  recorded_at timestamptz not null default now()
);

create index on parts (category_id);
create index on fitments (vehicle_id);
create index on price_history (part_id, recorded_at);

-- Catalog data is public read-only; writes happen from the service role (ingest jobs).
alter table categories enable row level security;
alter table vehicles enable row level security;
alter table parts enable row level security;
alter table fitments enable row level security;
alter table retailers enable row level security;
alter table prices enable row level security;
alter table price_history enable row level security;

create policy "public read" on categories for select using (true);
create policy "public read" on vehicles for select using (true);
create policy "public read" on parts for select using (true);
create policy "public read" on fitments for select using (true);
create policy "public read" on retailers for select using (true);
create policy "public read" on prices for select using (true);
create policy "public read" on price_history for select using (true);
