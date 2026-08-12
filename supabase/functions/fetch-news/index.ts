import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.1";
import { DOMParser } from "npm:linkedom@0.16.11";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Headline {
  title: string;
  url: string;
  source_name: string;
  published_at: string | null;
}

const RSS_FEEDS = [
  {
    url: "https://www.cqc.org.uk/news/rss",
    source_name: "CQC",
  },
  {
    url: "https://www.gov.uk/search/news-and-communications.atom?topics%5B%5D=health-and-social-care&organisations%5B%5D=department-of-health-and-social-care",
    source_name: "gov.uk",
  },
  {
    url: "https://www.gov.uk/search/news-and-communications.atom?organisations%5B%5D=nhs-england",
    source_name: "NHS England",
  },
  {
    url: "https://www.skillsforcare.org.uk/news/feed",
    source_name: "Skills for Care",
  },
];

function parseRSSItems(xml: string, sourceName: string): Headline[] {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const headlines: Headline[] = [];

  // Try RSS 2.0 <item> elements
  const items = doc.querySelectorAll("item");
  if (items.length > 0) {
    for (const item of Array.from(items).slice(0, 5)) {
      const title = item.querySelector("title")?.textContent?.trim();
      const link = item.querySelector("link")?.textContent?.trim();
      const pubDate = item.querySelector("pubDate")?.textContent?.trim();
      if (title && link) {
        headlines.push({
          title,
          url: link,
          source_name: sourceName,
          published_at: pubDate ? new Date(pubDate).toISOString() : null,
        });
      }
    }
    return headlines;
  }

  // Try Atom <entry> elements
  const entries = doc.querySelectorAll("entry");
  for (const entry of Array.from(entries).slice(0, 5)) {
    const title = entry.querySelector("title")?.textContent?.trim();
    const linkEl = entry.querySelector("link[href]");
    const link = linkEl?.getAttribute("href");
    const updated =
      entry.querySelector("updated")?.textContent?.trim() ||
      entry.querySelector("published")?.textContent?.trim();
    if (title && link) {
      headlines.push({
        title,
        url: link,
        source_name: sourceName,
        published_at: updated ? new Date(updated).toISOString() : null,
      });
    }
  }
  return headlines;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if we've fetched recently (within 30 minutes)
    const { data: recent } = await supabase
      .from("news_headlines")
      .select("fetched_at")
      .order("fetched_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recent?.fetched_at) {
      const lastFetch = new Date(recent.fetched_at).getTime();
      const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
      if (lastFetch > thirtyMinutesAgo) {
        // Return cached headlines
        const { data: cached } = await supabase
          .from("news_headlines")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(10);
        return new Response(
          JSON.stringify({ headlines: cached || [], cached: true }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Fetch all RSS feeds in parallel
    const allHeadlines: Headline[] = [];
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async (feed) => {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "CareLearn/1.0 NewsBot" },
        });
        if (!res.ok) return [];
        const xml = await res.text();
        return parseRSSItems(xml, feed.source_name);
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        allHeadlines.push(...result.value);
      }
    }

    // Sort by published_at descending, take top 10
    allHeadlines.sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return dateB - dateA;
    });
    const top = allHeadlines.slice(0, 10);

    if (top.length > 0) {
      // Clear old headlines and insert fresh ones
      await supabase.from("news_headlines").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("news_headlines").insert(top);
    }

    // Return fresh headlines from database
    const { data: fresh } = await supabase
      .from("news_headlines")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(10);

    return new Response(
      JSON.stringify({ headlines: fresh || [], cached: false }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
