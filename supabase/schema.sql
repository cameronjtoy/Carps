-- Carps schema: run in the Supabase SQL editor once the project exists.
-- Mirrors src/types.ts so src/api/index.ts can switch from mock data to Supabase.

create table sections (
  id text primary key,                -- 'power' | 'chassis' | 'wheels-tires' | 'style' | 'maintenance'
  name text not null,
  blurb text
);

create table categories (
  id text primary key,                -- e.g. 'coilovers'
  section_id text not null references sections(id),
  name text not null,
  description text,
  icon text,
  spec_columns jsonb not null default '[]',  -- [{ "key": "drop", "label": "Drop" }]
  default_qty int not null default 1,         -- 4 for wheels / tires
  performance boolean not null default false
);

create table vehicles (
  id text primary key default gen_random_uuid()::text,
  year int not null,
  make text not null,
  model text not null,
  trim text not null,
  chassis text not null,              -- FC1, ZN8, ND2, S550…
  platform text not null,             -- fitment group for platform-specific parts
  engine text not null,
  aspiration text not null check (aspiration in ('NA', 'Turbo', 'Supercharged')),
  drivetrain text not null,
  transmission text not null,
  stock_hp int not null,
  stock_tq int not null,
  curb_weight int not null,
  bolt_pattern text not null,         -- '5x114.3'
  center_bore numeric(5,1) not null,  -- mm
  stock_wheel jsonb not null,         -- { "diameter": 18, "width": 8.5, "offset": 55 }
  stock_tire text not null,           -- '245/40R18'
  min_wheel_diameter int not null,    -- smallest wheel that clears stock brakes
  unique (year, make, model, trim, engine)
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
  -- Performance data (null for plain maintenance parts)
  hp_gain int,
  tq_gain int,
  weight_delta numeric(6,1),          -- lbs, negative = lighter
  emissions text check (emissions in ('carb', '50-state', 'off-road')),
  carb_eo text,                        -- CARB Executive Order number
  difficulty int check (difficulty between 1 and 5),
  labor_hours numeric(4,1),
  requires_tune boolean default false,
  -- Universal parts (wheels, tires, seats, BBK wheel clearance) are checked by rule instead of fitments
  fit_rule jsonb,                      -- { "kind": "wheel", "boltPattern": "5x100", "centerBore": 73, ... }
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

-- User builds (once Supabase Auth is on). Public builds are shareable.
create table builds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  goal text not null default 'Daily',
  vehicle_id text references vehicles(id),
  carb_state boolean not null default false,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table build_items (
  build_id uuid references builds(id) on delete cascade,
  category_id text references categories(id),
  part_id text references parts(id),
  qty int not null default 1,
  primary key (build_id, category_id)
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
alter table sections enable row level security;
alter table builds enable row level security;
alter table build_items enable row level security;

create policy "public read" on categories for select using (true);
create policy "public read" on vehicles for select using (true);
create policy "public read" on parts for select using (true);
create policy "public read" on fitments for select using (true);
create policy "public read" on retailers for select using (true);
create policy "public read" on prices for select using (true);
create policy "public read" on price_history for select using (true);
create policy "public read" on sections for select using (true);

create policy "own or public builds" on builds for select using (is_public or auth.uid() = user_id);
create policy "own builds write" on builds for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "items of visible builds" on build_items for select
  using (exists (select 1 from builds b where b.id = build_id and (b.is_public or b.user_id = auth.uid())));
create policy "items of own builds" on build_items for all
  using (exists (select 1 from builds b where b.id = build_id and b.user_id = auth.uid()))
  with check (exists (select 1 from builds b where b.id = build_id and b.user_id = auth.uid()));
