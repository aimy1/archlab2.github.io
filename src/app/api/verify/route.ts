import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    // 调用 Google API 验证 Token
    const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    
    if (!googleResponse.ok) {
      const errorData = await googleResponse.json();
      console.error('[Auth Backend] Google verification failed:', errorData);
      return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }

    const payload = await googleResponse.json();
    
    // 返回用户信息
    return NextResponse.json({
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      uid: payload.sub
    });
  } catch (error) {
    console.error('[Auth Backend] Internal Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
