import React from 'react';

/**
 * 链接组件
 * @param props 链接组件属性
 * @param props.to 链接目标地址
 * @param props.className 链接类名
 * @param props.children 链接子元素
 * @returns
 */
export function Link({
  to,
  className,
  children,
  ...props
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  );
}
