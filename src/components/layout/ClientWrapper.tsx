
'use client';

import React from 'react';

/**
 * 这是一个简单的客户端包装器，用于在服务器组件中包装需要客户端交互的子组件
 */
export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
