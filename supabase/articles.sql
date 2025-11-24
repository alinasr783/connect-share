create extension if not exists pgcrypto;

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.articles (
  id uuid not null default gen_random_uuid(),
  title_en text not null,
  title_ar text not null,
  content_en text not null,
  content_ar text not null,
  image_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  show_on_homepage boolean null default true,
  constraint articles_pkey primary key (id)
);

create index if not exists idx_articles_created_at on public.articles using btree (created_at desc);

drop trigger if exists update_articles_updated_at on public.articles;
create trigger update_articles_updated_at
before update on public.articles
for each row execute function public.update_updated_at_column();