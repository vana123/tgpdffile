import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get('file_id');
  if (!fileId) {
    return new NextResponse('Missing file_id', { status: 400 });
  }

  const botToken = process.env.NEXT_PUBLIC_BOT_TOKEN;
  if (!botToken) {
    return new NextResponse('Missing bot token', { status: 500 });
  }

  // 1. Get file_path from Telegram
  const getFileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
  const getFileData = await getFileRes.json();
  if (!getFileData.ok || !getFileData.result?.file_path) {
    return new NextResponse('Failed to get file_path', { status: 404 });
  }
  const filePath = getFileData.result.file_path;

  // 2. Download the file from Telegram
  const fileRes = await fetch(`https://api.telegram.org/file/bot${botToken}/${filePath}`);
  if (!fileRes.ok) {
    return new NextResponse('Failed to download file', { status: 502 });
  }
  const fileBuffer = await fileRes.arrayBuffer();

  // 3. Return the file with correct headers
  const response = new NextResponse(Buffer.from(fileBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="file.pdf"',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'private, max-age=3600',
    },
  });
  return response;
} 