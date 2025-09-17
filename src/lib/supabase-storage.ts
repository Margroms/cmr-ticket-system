import { createClient } from "@supabase/supabase-js";

export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// Server-side privileged client for uploads/admin operations
export const supabaseService = () => {
  if (typeof window !== "undefined") {
    throw new Error("supabaseService can only be used on the server");
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  return createClient(url, key);
};

export async function uploadToBucket(
  bucket: string,
  path: string,
  file: File | Blob,
  options?: { upsert?: boolean; contentType?: string }
) {
  const client = supabasePublic;
  const res = await client.storage.from(bucket).upload(path, file, {
    upsert: options?.upsert ?? true,
    contentType: options?.contentType,
  });
  if (res.error) throw res.error;
  return res.data;
}

export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabasePublic.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
