import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { BUCKET_NAME } from '@/lib/constants';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { fileName, contentType } = await request.json();

  const ext = fileName.split('.').pop();
  const folder = (contentType as string).startsWith('video/') ? 'videos' : 'images';
  const path = `products/${folder}/${uuidv4()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Upload failed' }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path,
    publicUrl,
  });
}
