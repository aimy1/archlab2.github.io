'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Globe, 
  Search, 
  ArrowUpRight, 
  Monitor, 
  Share2, 
  Zap, 
  Box,
  Shield,
  Network,
  X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RevealOnScroll from '@/components/effects/RevealOnScroll';
import { useTranslation } from '@/components/LanguageProvider';
import Image from 'next/image';
import Link from 'next/link';

type Category = 'All' | 'Productivity' | 'Dev' | 'AI' | 'Design' | 'Infrastructure' | 'Security' | 'Social' | 'OS' | 'Network' | 'Privacy' | 'Database' | 'Media' | 'Finance';
type ResourceType = 'Software' | 'Website' | 'Social' | 'Linux' | 'Proxy';

interface Resource {
  id: string;
  name: string;
  description: string;
  descriptionCn?: string;
  url: string;
  category: Category;
  type: ResourceType;
  tags: string[];
  logoSlug: string; 
  logoUrl?: string;
  brandColor?: string;
  featured?: boolean;
}

function ResourceLogo({ logoSlug, logoUrl, name }: { logoSlug: string; logoUrl?: string; name: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-[60px] h-[60px] rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <span className="text-base font-black text-primary">{name.charAt(0).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <Image
      src={logoUrl || `https://cdn.simpleicons.org/${logoSlug}`}
      alt={name}
      width={60}
      height={60}
      className="object-contain drop-shadow-xl brightness-100 dark:brightness-110"
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}

const DISCOVERY_RESOURCES: Resource[] = [
  // --- PROXY & NETWORK ---
  { id: 'clash-verge', name: 'Clash Verge (Revive)', description: 'Modern Clash GUI based on Tauri. High-performance and cross-platform.', descriptionCn: '基于 Tauri 的现代 Clash 客户端，高性能且跨平台。', url: 'https://github.com/clash-verge-rev/clash-verge-rev', category: 'Network', type: 'Proxy', tags: ['Tauri', 'Cross-platform'], logoSlug: 'clashverge', logoUrl: 'https://github.com/clash-verge-rev.png', brandColor: '67c23a', featured: true },
  { id: 'clash-for-windows', name: 'Clash for Windows', description: 'Classic Clash GUI client for Windows and macOS.', descriptionCn: '经典 Clash 图形客户端，覆盖 Windows 与 macOS。', url: 'https://github.com/Fndroid/clash_for_windows_pkg', category: 'Network', type: 'Proxy', tags: ['Windows', 'Classic'], logoSlug: 'clash', logoUrl: 'https://github.com/Fndroid.png', brandColor: '3B82F6', featured: true },
  { id: 'clashx', name: 'ClashX', description: 'Native macOS menu-bar client based on Clash core.', descriptionCn: '基于 Clash 内核的原生 macOS 菜单栏客户端。', url: 'https://github.com/yichengchen/clashX', category: 'Network', type: 'Proxy', tags: ['macOS', 'Native'], logoSlug: 'clash', logoUrl: 'https://github.com/yichengchen.png', brandColor: '111827' },
  { id: 'clash-meta', name: 'Clash Meta (Mihomo)', description: 'Enhanced Clash-compatible core with wider protocol support.', descriptionCn: '增强版 Clash 兼容内核，支持更广泛协议。', url: 'https://github.com/MetaCubeX/mihomo', category: 'Network', type: 'Proxy', tags: ['Core', 'Mihomo'], logoSlug: 'clash', logoUrl: 'https://github.com/MetaCubeX.png', brandColor: '0F766E', featured: true },
  { id: 'clash-nyanpasu', name: 'Clash Nyanpasu', description: 'Modern Clash GUI with profile management and polished UX.', descriptionCn: '现代化 Clash 客户端，提供完善的配置管理与交互体验。', url: 'https://github.com/libnyanpasu/clash-nyanpasu', category: 'Network', type: 'Proxy', tags: ['Cross-platform', 'Modern'], logoSlug: 'clash', logoUrl: 'https://github.com/libnyanpasu.png', brandColor: 'EC4899' },
  { id: 'openclash', name: 'OpenClash', description: 'OpenWrt Clash plugin with rule management and transparent proxy.', descriptionCn: 'OpenWrt 上的 Clash 插件，支持规则管理与透明代理。', url: 'https://github.com/vernesong/OpenClash', category: 'Network', type: 'Proxy', tags: ['OpenWrt', 'Router'], logoSlug: 'clash', logoUrl: 'https://github.com/vernesong.png', brandColor: '22C55E' },
  { id: 'sing-box', name: 'sing-box', description: 'The universal proxy platform. Supports almost all proxy protocols.', descriptionCn: '通用代理平台，支持几乎所有主流代理协议。', url: 'https://sing-box.sagernet.org/', category: 'Network', type: 'Proxy', tags: ['Universal', 'Engine'], logoSlug: 'singbox', logoUrl: 'https://github.com/SagerNet.png', brandColor: '000000', featured: true },
  { id: 'surge-mac', name: 'Surge', description: 'The ultimate network debugging and proxy tool for macOS and iOS.', descriptionCn: '适用于 macOS 和 iOS 的终极网络调试和代理工具任务。', url: 'https://nssurge.com/', category: 'Network', type: 'Proxy', tags: ['MacOS', 'Professional'], logoSlug: 'surge', logoUrl: 'https://nssurge.com/favicon.ico', brandColor: '191919', featured: true },
  { id: 'shadowrocket', name: 'Shadowrocket', description: 'Powerful rule-based proxy utility client for iOS.', descriptionCn: 'iOS 上强大的基于规则的代理实用客户端。', url: 'https://apps.apple.com/app/shadowrocket/id932747118', category: 'Security', type: 'Proxy', tags: ['iOS', 'Rule-based'], logoSlug: 'shadowrocket', logoUrl: 'https://apps.apple.com/favicon.ico', brandColor: '007aff', featured: true },
  { id: 'tailscale', name: 'Tailscale', description: 'Zero config VPN. Build a secure mesh network in minutes.', descriptionCn: '零配置 VPN，分钟级构建安全的网状网络。', url: 'https://tailscale.com/', category: 'Network', type: 'Proxy', tags: ['SD-WAN', 'Mesh'], logoSlug: 'tailscale', brandColor: '000000', featured: true },
  { id: 'stash', name: 'Stash', description: 'Rule-based proxy client for iOS/macOS/tvOS, compatible with Clash.', descriptionCn: 'iOS/macOS/tvOS 上基于规则的代理客户端，兼容 Clash。', url: 'https://stash.ws/', category: 'Network', type: 'Proxy', tags: ['iOS', 'MacOS'], logoSlug: 'stash', logoUrl: 'https://stash.ws/favicon.ico', brandColor: '000000' },
  { id: 'v2rayn', name: 'v2rayN', description: 'A GUI client for Windows, support Xray core and v2fly-core.', descriptionCn: 'Windows 平台上最流行的代理客户端，支持 Xray 和 v2fly 核心。', url: 'https://github.com/2dust/v2rayN', category: 'Network', type: 'Proxy', tags: ['Windows', 'Xray'], logoSlug: 'v2rayn', logoUrl: 'https://github.com/2dust.png', brandColor: '00adb5' },
  { id: 'v2rayng', name: 'v2rayNG', description: 'Mainstream Android GUI client for V2Ray/Xray protocol stacks.', descriptionCn: 'Android 平台主流的 V2Ray/Xray 图形客户端。', url: 'https://github.com/2dust/v2rayNG', category: 'Network', type: 'Proxy', tags: ['Android', 'Xray'], logoSlug: 'v2rayng', logoUrl: 'https://github.com/2dust.png', brandColor: '3DDC84' },
  { id: 'shadowsocks', name: 'Shadowsocks', description: 'Lightweight encrypted SOCKS5 proxy suite with broad client support.', descriptionCn: '轻量级加密 SOCKS5 代理套件，拥有广泛客户端支持。', url: 'https://github.com/shadowsocks', category: 'Network', type: 'Proxy', tags: ['SOCKS5', 'Cross-platform'], logoSlug: 'shadowsocks', logoUrl: 'https://github.com/shadowsocks.png', brandColor: '4A90E2' },
  { id: 'trojan-gfw', name: 'Trojan-GFW', description: 'TLS-based proxy designed for censorship resistance and stealth.', descriptionCn: '基于 TLS 的代理方案，具备较强抗封锁与伪装能力。', url: 'https://github.com/trojan-gfw/trojan', category: 'Security', type: 'Proxy', tags: ['TLS', 'Stealth'], logoSlug: 'trojangfw', logoUrl: 'https://github.com/trojan-gfw.png', brandColor: '003A70' },
  { id: 'naiveproxy', name: 'NaiveProxy', description: 'Chromium-network-stack based HTTPS/HTTP3 proxy implementation.', descriptionCn: '基于 Chromium 网络栈的 HTTPS/HTTP3 代理实现。', url: 'https://github.com/klzgrad/naiveproxy', category: 'Network', type: 'Proxy', tags: ['HTTP/3', 'Stealth'], logoSlug: 'naiveproxy', logoUrl: 'https://github.com/klzgrad.png', brandColor: '4285F4' },
  { id: 'hysteria', name: 'Hysteria', description: 'High-performance QUIC proxy focusing on UDP throughput and resilience.', descriptionCn: '高性能 QUIC 代理，重点优化 UDP 吞吐与抗干扰能力。', url: 'https://github.com/apernet/hysteria', category: 'Network', type: 'Proxy', tags: ['QUIC', 'UDP'], logoSlug: 'hysteria', logoUrl: 'https://github.com/apernet.png', brandColor: '6D28D9' },
  { id: 'tuic', name: 'TUIC', description: 'Low-latency proxy protocol over QUIC and modern TLS transport.', descriptionCn: '基于 QUIC 与现代 TLS 传输的低延迟代理协议。', url: 'https://github.com/EAimTY/tuic', category: 'Network', type: 'Proxy', tags: ['QUIC', 'Low-latency'], logoSlug: 'tuic', logoUrl: 'https://github.com/EAimTY.png', brandColor: 'DEA584' },
  { id: 'brook', name: 'Brook', description: 'Simple and lightweight proxy suite for quick deployment.', descriptionCn: '简单轻量的代理套件，适合快速部署与跨平台使用。', url: 'https://github.com/txthinking/brook', category: 'Network', type: 'Proxy', tags: ['Simple', 'Cross-platform'], logoSlug: 'brook', logoUrl: 'https://github.com/txthinking.png', brandColor: '181717' },
  { id: 'quantumult-x', name: 'Quantumult X', description: 'Advanced iOS proxy client with flexible routing and script support.', descriptionCn: '高级 iOS 代理客户端，支持灵活分流与脚本能力。', url: 'https://apps.apple.com/cn/app/quantumult-x/id1443988620', category: 'Security', type: 'Proxy', tags: ['iOS', 'Rule-based'], logoSlug: 'quantumultx', logoUrl: 'https://apps.apple.com/favicon.ico', brandColor: '000000' },
  { id: 'kitsunebi', name: 'Kitsunebi', description: 'Lightweight iOS client supporting VMess and VLESS protocols.', descriptionCn: '轻量级 iOS 客户端，支持 VMess 与 VLESS 协议。', url: 'https://kitsuapp.com', category: 'Network', type: 'Proxy', tags: ['iOS', 'VMess'], logoSlug: 'kitsunebi', logoUrl: 'https://apps.apple.com/favicon.ico', brandColor: 'F05138' },
  { id: 'wireguard', name: 'WireGuard', description: 'Extremely simple yet fast and modern VPN.', descriptionCn: '极简且高速的现代 VPN 协议。', url: 'https://www.wireguard.com/', category: 'Security', type: 'Proxy', tags: ['VPN', 'Kernel'], logoSlug: 'wireguard', brandColor: '881717' },
  { id: 'adguard', name: 'AdGuard', description: 'The world\'s most advanced ad blocking and privacy protection software.', descriptionCn: '全球领先的广告拦截与隐私保护软件。', url: 'https://adguard.com/', category: 'Privacy', type: 'Proxy', tags: ['Adblock', 'Privacy'], logoSlug: 'adguard', brandColor: '67c23a' },

  // --- LINUX DISTROS ---
  { id: 'mx-linux', name: 'MX Linux', description: 'A stable and efficient desktop Linux distribution based on Debian.', descriptionCn: '基于 Debian 的稳定高效桌面发行版。', url: 'https://mxlinux.org/', category: 'OS', type: 'Linux', tags: ['Desktop', 'Stable'], logoSlug: 'mxlinux', brandColor: '005B96', featured: true },
  { id: 'linux-mint', name: 'Linux Mint', description: 'User-friendly desktop Linux with an out-of-the-box experience.', descriptionCn: '开箱即用、对新手友好的桌面 Linux。', url: 'https://linuxmint.com/', category: 'OS', type: 'Linux', tags: ['Beginner', 'Desktop'], logoSlug: 'linuxmint', brandColor: '87CF3E', featured: true },
  { id: 'endeavouros', name: 'EndeavourOS', description: 'Arch-based distribution focused on a clean and near-vanilla experience.', descriptionCn: '基于 Arch，强调简洁与接近原生体验。', url: 'https://endeavouros.com/', category: 'OS', type: 'Linux', tags: ['Arch-based', 'Rolling'], logoSlug: 'endeavouros', brandColor: '7F00FF', featured: true },
  { id: 'debian', name: 'Debian', description: 'The Universal Operating System. Rock-solid stability for servers.', descriptionCn: '通用操作系统，为服务器提供磐石般的稳定性。', url: 'https://debian.org/', category: 'OS', type: 'Linux', tags: ['Stable', 'Universal'], logoSlug: 'debian', brandColor: 'A81D33', featured: true },
  { id: 'manjaro', name: 'Manjaro', description: 'A user-friendly Arch-based distro with curated updates.', descriptionCn: '更易用的 Arch 系发行版，提供审核后的滚动更新。', url: 'https://manjaro.org/', category: 'OS', type: 'Linux', tags: ['Arch-based', 'Desktop'], logoSlug: 'manjaro', brandColor: '35BF5C', featured: true },
  { id: 'ubuntu', name: 'Ubuntu', description: 'Popular Linux platform for desktop, server, and cloud.', descriptionCn: '覆盖桌面、服务器与云场景的主流 Linux 平台。', url: 'https://ubuntu.com/', category: 'OS', type: 'Linux', tags: ['Desktop', 'Server'], logoSlug: 'ubuntu', brandColor: 'E95420', featured: true },
  { id: 'fedora', name: 'Fedora Linux', description: 'Community-driven distribution featuring modern open-source technology.', descriptionCn: '社区驱动、强调前沿开源技术的发行版。', url: 'https://fedoraproject.org/', category: 'Dev', type: 'Linux', tags: ['Cutting-edge', 'Community'], logoSlug: 'fedora', brandColor: '51A2DA', featured: true },
  { id: 'nixos', name: 'NixOS', description: 'Declarative and reproducible Linux. Configuration is functional and immutable.', descriptionCn: '声明式且可复现的 Linux，配置完全函数化且不可变。', url: 'https://nixos.org/', category: 'Dev', type: 'Linux', tags: ['Declarative', 'Immutable'], logoSlug: 'nixos', brandColor: '5277C3', featured: true },
  { id: 'pop-os', name: 'Pop!_OS', description: 'Ubuntu-based desktop Linux optimized for creators and developers.', descriptionCn: '面向创作者和开发者优化的 Ubuntu 系桌面发行版。', url: 'https://pop.system76.com/', category: 'Dev', type: 'Linux', tags: ['Creator', 'Desktop'], logoSlug: 'popos', brandColor: '48B9C7', featured: true },
  { id: 'zorin', name: 'Zorin OS', description: 'Desktop Linux designed to ease migration from Windows and macOS.', descriptionCn: '帮助用户从 Windows 与 macOS 平滑迁移的桌面发行版。', url: 'https://zorin.com/os/', category: 'OS', type: 'Linux', tags: ['Beginner', 'Desktop'], logoSlug: 'zorin', brandColor: '0CC1F3', featured: true },
  { id: 'elementary', name: 'elementary OS', description: 'Design-focused Linux distribution with a polished desktop experience.', descriptionCn: '以设计和一致性著称的精致桌面发行版。', url: 'https://elementary.io/', category: 'Design', type: 'Linux', tags: ['Design', 'Desktop'], logoSlug: 'elementary', brandColor: '64BAFF' },
  { id: 'opensuse', name: 'openSUSE', description: 'Flexible distribution available as Leap and Tumbleweed editions.', descriptionCn: '提供 Leap 与 Tumbleweed 双路线的灵活发行版。', url: 'https://www.opensuse.org/', category: 'OS', type: 'Linux', tags: ['Leap', 'Tumbleweed'], logoSlug: 'opensuse', brandColor: '73BA25' },
  { id: 'arch', name: 'Arch Linux', description: 'A lightweight and flexible Linux distribution that tries to Keep It Simple (KISS).', descriptionCn: '轻量、灵活的 Linux 发行版，遵循 KISS 原则。', url: 'https://archlinux.org/', category: 'OS', type: 'Linux', tags: ['Rolling', 'DIY'], logoSlug: 'archlinux', brandColor: '1793D1' },
  { id: 'garuda', name: 'Garuda Linux', description: 'Performance-oriented Arch-based distro with rich desktop presets.', descriptionCn: '高性能取向的 Arch 系发行版，提供丰富桌面预设。', url: 'https://garudalinux.org/', category: 'OS', type: 'Linux', tags: ['Arch-based', 'Performance'], logoSlug: 'garuda', logoUrl: 'https://garudalinux.org/favicon.ico', brandColor: '6D28D9' },
  { id: 'kde-neon', name: 'KDE neon', description: 'Ubuntu base with the latest KDE Plasma desktop software.', descriptionCn: '基于 Ubuntu，提供最新 KDE Plasma 桌面体验。', url: 'https://neon.kde.org/', category: 'OS', type: 'Linux', tags: ['KDE', 'Desktop'], logoSlug: 'kdeneon', brandColor: '1D99F3' },
  { id: 'solus', name: 'Solus', description: 'Independent desktop-focused Linux distribution with curated software.', descriptionCn: '独立开发、聚焦桌面体验的软件精选发行版。', url: 'https://getsol.us/', category: 'OS', type: 'Linux', tags: ['Independent', 'Desktop'], logoSlug: 'solus', brandColor: '5294E2' },
  { id: 'deepin', name: 'Deepin', description: 'Elegant Linux desktop distribution with a custom desktop environment.', descriptionCn: '拥有自研桌面环境、界面优雅的 Linux 发行版。', url: 'https://www.deepin.org/', category: 'Design', type: 'Linux', tags: ['Desktop', 'UX'], logoSlug: 'deepin', brandColor: '007CFF' },
  { id: 'kubuntu', name: 'Kubuntu', description: 'Official Ubuntu flavor powered by KDE Plasma.', descriptionCn: '官方 Ubuntu KDE 版本，适合 KDE 用户。', url: 'https://kubuntu.org/', category: 'OS', type: 'Linux', tags: ['Ubuntu Flavor', 'KDE'], logoSlug: 'kubuntu', brandColor: '0079C1' },
  { id: 'xubuntu', name: 'Xubuntu', description: 'Official Ubuntu flavor with the lightweight Xfce desktop.', descriptionCn: '官方 Ubuntu Xfce 版本，轻量且高效。', url: 'https://xubuntu.org/', category: 'OS', type: 'Linux', tags: ['Ubuntu Flavor', 'Xfce'], logoSlug: 'xubuntu', brandColor: '0044AA' },
  { id: 'lubuntu', name: 'Lubuntu', description: 'Fast and lightweight Ubuntu flavor using LXQt.', descriptionCn: '基于 LXQt 的轻量 Ubuntu 版本，速度快占用低。', url: 'https://lubuntu.me/', category: 'OS', type: 'Linux', tags: ['Ubuntu Flavor', 'LXQt'], logoSlug: 'lubuntu', brandColor: '0068C8' },
  { id: 'ubuntu-mate', name: 'Ubuntu MATE', description: 'Ubuntu flavor focused on a classic desktop metaphor.', descriptionCn: '强调传统桌面交互体验的 Ubuntu 版本。', url: 'https://ubuntu-mate.org/', category: 'OS', type: 'Linux', tags: ['Ubuntu Flavor', 'MATE'], logoSlug: 'ubuntumate', brandColor: '84A454' },
  { id: 'ubuntu-studio', name: 'Ubuntu Studio', description: 'Ubuntu flavor tailored for audio, video, graphics, and publishing.', descriptionCn: '面向音视频、图形和创作工作流的 Ubuntu 版本。', url: 'https://ubuntustudio.org/', category: 'Media', type: 'Linux', tags: ['Creative', 'Studio'], logoSlug: 'ubuntustudio', logoUrl: 'https://ubuntustudio.org/favicon.ico', brandColor: 'A03472' },
  { id: 'linux-lite', name: 'Linux Lite', description: 'Beginner-oriented Linux designed for smooth migration from Windows.', descriptionCn: '为 Windows 转 Linux 用户设计的轻量友好发行版。', url: 'https://www.linuxliteos.com/', category: 'OS', type: 'Linux', tags: ['Beginner', 'Lightweight'], logoSlug: 'linuxlite', logoUrl: 'https://www.linuxliteos.com/favicon.ico', brandColor: '4FA8D9' },
  { id: 'anti-x', name: 'antiX', description: 'Lightweight Debian-based distro suitable for older hardware.', descriptionCn: '轻量 Debian 系发行版，适合老旧硬件。', url: 'https://antixlinux.com/', category: 'OS', type: 'Linux', tags: ['Debian-based', 'Lightweight'], logoSlug: 'antix', logoUrl: 'https://antixlinux.com/favicon.ico', brandColor: '111111' },
  { id: 'puppy', name: 'Puppy Linux', description: 'Ultra-light Linux that runs well on low-resource systems.', descriptionCn: '超轻量 Linux，在低配置设备上也能流畅运行。', url: 'https://puppylinux-woof-ce.github.io/', category: 'OS', type: 'Linux', tags: ['Ultra-light', 'Portable'], logoSlug: 'puppylinux', logoUrl: 'https://puppylinux-woof-ce.github.io/favicon.ico', brandColor: 'FFB300' },
  { id: 'sparkylinux', name: 'SparkyLinux', description: 'Debian-based distro offering stable and rolling channels.', descriptionCn: '提供稳定版与滚动版的 Debian 系发行版。', url: 'https://sparkylinux.org/', category: 'OS', type: 'Linux', tags: ['Debian-based', 'Rolling'], logoSlug: 'sparkylinux', logoUrl: 'https://sparkylinux.org/favicon.ico', brandColor: '0E7490' },
  { id: 'peppermint', name: 'Peppermint OS', description: 'Cloud-centric lightweight distribution for everyday desktop use.', descriptionCn: '强调轻量和云集成的日常桌面发行版。', url: 'https://peppermintos.com/', category: 'OS', type: 'Linux', tags: ['Cloud', 'Lightweight'], logoSlug: 'peppermint', logoUrl: 'https://peppermintos.com/favicon.ico', brandColor: 'DC2626' },
  { id: 'bodhi', name: 'Bodhi Linux', description: 'Minimal Ubuntu-based distro with the Moksha desktop.', descriptionCn: '基于 Ubuntu 的极简发行版，搭载 Moksha 桌面。', url: 'https://www.bodhilinux.com/', category: 'OS', type: 'Linux', tags: ['Minimal', 'Desktop'], logoSlug: 'bodhilinux', logoUrl: 'https://www.bodhilinux.com/favicon.ico', brandColor: '65A30D' },
  { id: 'mageia', name: 'Mageia', description: 'Community-driven Linux distribution continuing the Mandriva lineage.', descriptionCn: '社区驱动发行版，延续 Mandriva 技术路线。', url: 'https://www.mageia.org/', category: 'OS', type: 'Linux', tags: ['Community', 'Desktop'], logoSlug: 'mageia', logoUrl: 'https://www.mageia.org/favicon.ico', brandColor: '2397D4' },
  { id: 'pclinuxos', name: 'PCLinuxOS', description: 'Desktop Linux distribution with a rolling-release model.', descriptionCn: '采用滚动更新模式的经典桌面发行版。', url: 'https://www.pclinuxos.com/', category: 'OS', type: 'Linux', tags: ['Rolling', 'Desktop'], logoSlug: 'pclinuxos', logoUrl: 'https://www.pclinuxos.com/favicon.ico', brandColor: '1F2937' },
  { id: 'void', name: 'Void Linux', description: 'Independent rolling distro with runit init system.', descriptionCn: '独立滚动发行版，使用 runit 初始化系统。', url: 'https://voidlinux.org/', category: 'OS', type: 'Linux', tags: ['Independent', 'runit'], logoSlug: 'voidlinux', brandColor: '478061' },
  { id: 'gentoo', name: 'Gentoo Linux', description: 'Source-based distribution with deep customization capabilities.', descriptionCn: '源码构建型发行版，提供极致可定制能力。', url: 'https://www.gentoo.org/', category: 'Dev', type: 'Linux', tags: ['Source-based', 'Custom'], logoSlug: 'gentoo', brandColor: '54487A' },
  { id: 'slackware', name: 'Slackware', description: 'One of the oldest surviving Linux distributions, focused on simplicity.', descriptionCn: '历史悠久的 Linux 发行版，强调简洁与传统。', url: 'http://www.slackware.com/', category: 'OS', type: 'Linux', tags: ['Classic', 'Unix-like'], logoSlug: 'slackware', brandColor: '0EA5E9' },
  { id: 'devuan', name: 'Devuan', description: 'Debian fork that preserves init freedom and avoids systemd by default.', descriptionCn: 'Debian 分支，默认避免 systemd 并保留 init 自由。', url: 'https://www.devuan.org/', category: 'OS', type: 'Linux', tags: ['Debian Fork', 'Non-systemd'], logoSlug: 'devuan', brandColor: '2563EB' },
  { id: 'parrot', name: 'Parrot Security', description: 'Security-focused distro for penetration testing, privacy, and development.', descriptionCn: '面向渗透测试、隐私与开发的安全发行版。', url: 'https://www.parrotsec.org/', category: 'Security', type: 'Linux', tags: ['Pentest', 'Privacy'], logoSlug: 'parrotsecurity', brandColor: '10B981' },
  { id: 'tails', name: 'Tails', description: 'Privacy-first live operating system that routes traffic through Tor.', descriptionCn: '以隐私为核心的 Live 系统，默认流量经 Tor 网络。', url: 'https://tails.net/', category: 'Privacy', type: 'Linux', tags: ['Tor', 'Live'], logoSlug: 'tails', brandColor: '6D28D9' },
  { id: 'qubes', name: 'Qubes OS', description: 'Security-by-isolation desktop operating system using virtualization.', descriptionCn: '通过虚拟化隔离实现高安全性的桌面系统。', url: 'https://www.qubes-os.org/', category: 'Security', type: 'Linux', tags: ['Isolation', 'Virtualization'], logoSlug: 'qubesos', brandColor: '1E3A8A' },
  { id: 'blackarch', name: 'BlackArch', description: 'Arch-based penetration testing distribution with extensive toolsets.', descriptionCn: '基于 Arch 的渗透测试发行版，内置大量安全工具。', url: 'https://www.blackarch.org/', category: 'Security', type: 'Linux', tags: ['Pentest', 'Arch-based'], logoSlug: 'blackarch', logoUrl: 'https://www.blackarch.org/favicon.ico', brandColor: '111827' },
  { id: 'alpine', name: 'Alpine Linux', description: 'A security-oriented, lightweight Linux distribution based on musl libc and busybox.', descriptionCn: '面向安全、极其轻量的 Linux 发行版。', url: 'https://alpinelinux.org/', category: 'Infrastructure', type: 'Linux', tags: ['Docker', 'Small'], logoSlug: 'alpinelinux', brandColor: '0D597F' },
  { id: 'raspberry-pi-os', name: 'Raspberry Pi OS', description: 'Official Debian-based operating system for Raspberry Pi devices.', descriptionCn: '树莓派官方 Debian 系操作系统。', url: 'https://www.raspberrypi.com/software/', category: 'OS', type: 'Linux', tags: ['ARM', 'Education'], logoSlug: 'raspberrypi', brandColor: 'C51A4A' },
  { id: 'rocky-linux', name: 'Rocky Linux', description: 'Enterprise-grade Linux compatible with RHEL ecosystems.', descriptionCn: '面向企业场景、兼容 RHEL 生态的发行版。', url: 'https://rockylinux.org/', category: 'Infrastructure', type: 'Linux', tags: ['Enterprise', 'Server'], logoSlug: 'rockylinux', brandColor: '10B981' },
  { id: 'alma-linux', name: 'AlmaLinux', description: 'Community-owned enterprise Linux for server workloads.', descriptionCn: '社区治理的企业级 Linux，面向服务器工作负载。', url: 'https://almalinux.org/', category: 'Infrastructure', type: 'Linux', tags: ['Enterprise', 'Server'], logoSlug: 'almalinux', brandColor: '0EA5E9' },
  { id: 'centos-stream', name: 'CentOS Stream', description: 'Continuously delivered distro that tracks just ahead of RHEL.', descriptionCn: '持续交付发行版，位于 RHEL 上游。', url: 'https://www.centos.org/centos-stream/', category: 'Infrastructure', type: 'Linux', tags: ['Enterprise', 'Upstream'], logoSlug: 'centos', brandColor: '8B5CF6' },
  { id: 'oracle-linux', name: 'Oracle Linux', description: 'Enterprise Linux distribution optimized for Oracle workloads.', descriptionCn: '针对 Oracle 场景优化的企业级 Linux 发行版。', url: 'https://www.oracle.com/linux/', category: 'Infrastructure', type: 'Linux', tags: ['Enterprise', 'Oracle'], logoSlug: 'oracle', logoUrl: 'https://www.oracle.com/favicon.ico', brandColor: 'F80000' },
  { id: 'clear-linux', name: 'Clear Linux', description: 'Performance-optimized Linux distribution maintained by Intel.', descriptionCn: '由 Intel 维护、强调性能优化的 Linux 发行版。', url: 'https://www.clearlinux.org/', category: 'Dev', type: 'Linux', tags: ['Performance', 'Intel'], logoSlug: 'clearlinux', logoUrl: 'https://www.clearlinux.org/favicon.ico', brandColor: '2563EB' },
  { id: 'cachyos', name: 'CachyOS', description: 'Arch-based distro tuned for speed and modern CPU optimizations.', descriptionCn: '基于 Arch，强调速度和现代 CPU 优化。', url: 'https://cachyos.org/', category: 'OS', type: 'Linux', tags: ['Arch-based', 'Performance'], logoSlug: 'cachyos', logoUrl: 'https://cachyos.org/favicon.ico', brandColor: '7C3AED' },
  { id: 'nobara', name: 'Nobara', description: 'Fedora-based distro tailored for gaming and content creation.', descriptionCn: '基于 Fedora，面向游戏与内容创作场景。', url: 'https://nobaraproject.org/', category: 'Media', type: 'Linux', tags: ['Gaming', 'Fedora-based'], logoSlug: 'nobara', logoUrl: 'https://nobaraproject.org/favicon.ico', brandColor: '2563EB' },
  { id: 'rhel', name: 'Red Hat Enterprise Linux', description: 'Commercial enterprise Linux platform for mission-critical systems.', descriptionCn: '面向关键业务系统的商业企业级 Linux 平台。', url: 'https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux', category: 'Infrastructure', type: 'Linux', tags: ['Enterprise', 'Commercial'], logoSlug: 'redhat', brandColor: 'EE0000' },
  { id: 'kali', name: 'Kali Linux', description: 'The standard for penetration testing and digital forensics.', descriptionCn: '渗透测试和数字取证的行业标准发行版。', url: 'https://www.kali.org/', category: 'Security', type: 'Linux', tags: ['Pentest', 'Security'], logoSlug: 'kalilinux', brandColor: '557C94' },
  { id: 'openwrt', name: 'OpenWrt', description: 'Linux operating system targeting embedded devices and routers.', descriptionCn: '针对嵌入式设备与路由器的 Linux 操作系统。', url: 'https://openwrt.org/', category: 'Network', type: 'Linux', tags: ['Router', 'Embedded'], logoSlug: 'openwrt', brandColor: '000000' },

  // --- WEBSITES ---
  { id: 'vercel', name: 'Vercel', description: 'The platform for frontend developers.', descriptionCn: '前端开发者的终极平台。', url: 'https://vercel.com', category: 'Infrastructure', type: 'Website', tags: ['NextJS', 'Cloud'], logoSlug: 'vercel', brandColor: '000000', featured: true },
  { id: 'github-web', name: 'GitHub', description: 'Where the world builds software.', descriptionCn: '全球软件开发的中心。', url: 'https://github.com', category: 'Dev', type: 'Website', tags: ['Git', 'Community'], logoSlug: 'github', brandColor: '181717', featured: true },
  { id: 'linear-web', name: 'Linear', description: 'The issue tracker you\'ll actually enjoy using.', descriptionCn: '一个你真正会喜欢用的任务追踪系统。', url: 'https://linear.app', category: 'Productivity', type: 'Website', tags: ['PM', 'Efficiency'], logoSlug: 'linear', brandColor: '5E6AD2' },
  { id: 'framer', name: 'Framer', description: 'The site builder for designers.', descriptionCn: '为设计师打造的网站构建工具。', url: 'https://framer.com', category: 'Design', type: 'Website', tags: ['No-code', 'UI'], logoSlug: 'framer', brandColor: '0055FF' },
  { id: 'notion', name: 'Notion', description: 'All-in-one workspace for docs, wikis, and databases.', descriptionCn: '集文档、知识库和数据库于一体的协作工作台。', url: 'https://www.notion.so', category: 'Productivity', type: 'Website', tags: ['Docs', 'Workspace'], logoSlug: 'notion', brandColor: '000000', featured: true },
  { id: 'figma', name: 'Figma', description: 'Collaborative interface design and prototyping tool.', descriptionCn: '面向团队的界面设计与原型协作工具。', url: 'https://www.figma.com', category: 'Design', type: 'Website', tags: ['Design', 'Prototype'], logoSlug: 'figma', brandColor: 'F24E1E', featured: true },
  { id: 'canva', name: 'Canva', description: 'Online design platform for fast visual creation.', descriptionCn: '快速制作视觉内容的在线设计平台。', url: 'https://www.canva.com', category: 'Design', type: 'Website', tags: ['Design', 'Templates'], logoSlug: 'canva', logoUrl: 'https://www.canva.com/favicon.ico', brandColor: '00C4CC' },
  { id: 'webflow', name: 'Webflow', description: 'Visual web development platform for production sites.', descriptionCn: '面向生产级网站的可视化开发平台。', url: 'https://webflow.com', category: 'Design', type: 'Website', tags: ['No-code', 'CMS'], logoSlug: 'webflow', brandColor: '146EF5' },
  { id: 'vite', name: 'Vite', description: 'Next-generation frontend tooling and build system.', descriptionCn: '新一代前端构建工具与开发体验平台。', url: 'https://vitejs.dev', category: 'Dev', type: 'Website', tags: ['Build', 'Tooling'], logoSlug: 'vite', brandColor: '646CFF' },
  { id: 'stackoverflow', name: 'Stack Overflow', description: 'The largest developer Q&A community.', descriptionCn: '全球最大的开发者问答社区。', url: 'https://stackoverflow.com', category: 'Dev', type: 'Website', tags: ['Q&A', 'Community'], logoSlug: 'stackoverflow', brandColor: 'F58025' },
  { id: 'mdn', name: 'MDN Web Docs', description: 'The canonical documentation for web standards.', descriptionCn: '权威的 Web 标准文档与学习资源。', url: 'https://developer.mozilla.org', category: 'Dev', type: 'Website', tags: ['Docs', 'Web'], logoSlug: 'mdnwebdocs', brandColor: '000000' },
  { id: 'cloudflare', name: 'Cloudflare', description: 'Edge network, security, and performance platform.', descriptionCn: '提供边缘网络、安全与性能加速的平台。', url: 'https://www.cloudflare.com', category: 'Infrastructure', type: 'Website', tags: ['CDN', 'Security'], logoSlug: 'cloudflare', brandColor: 'F38020', featured: true },
  { id: 'supabase', name: 'Supabase', description: 'Open source Firebase alternative for Postgres.', descriptionCn: '基于 Postgres 的开源 Firebase 替代方案。', url: 'https://supabase.com', category: 'Database', type: 'Website', tags: ['Postgres', 'Backend'], logoSlug: 'supabase', brandColor: '3ECF8E' },
  { id: 'firebase-web', name: 'Firebase', description: 'App development platform with realtime services.', descriptionCn: '提供实时服务的应用开发平台。', url: 'https://firebase.google.com', category: 'Infrastructure', type: 'Website', tags: ['Backend', 'Realtime'], logoSlug: 'firebase', brandColor: 'FFCA28' },
  { id: 'netlify', name: 'Netlify', description: 'Frontend cloud and automated web deployments.', descriptionCn: '前端云与自动化部署平台。', url: 'https://www.netlify.com', category: 'Infrastructure', type: 'Website', tags: ['Deploy', 'Edge'], logoSlug: 'netlify', brandColor: '00C7B7' },
  { id: 'railway', name: 'Railway', description: 'Instant app hosting with databases and services.', descriptionCn: '集成数据库与服务的一键部署平台。', url: 'https://railway.app', category: 'Infrastructure', type: 'Website', tags: ['PaaS', 'Deploy'], logoSlug: 'railway', brandColor: '0B0D0E' },
  { id: 'render', name: 'Render', description: 'Unified cloud to build and run apps.', descriptionCn: '一体化应用构建与运行云平台。', url: 'https://render.com', category: 'Infrastructure', type: 'Website', tags: ['PaaS', 'Cloud'], logoSlug: 'render', brandColor: '46E3B7' },
  { id: 'digitalocean', name: 'DigitalOcean', description: 'Developer-friendly cloud computing platform.', descriptionCn: '面向开发者的云计算平台。', url: 'https://www.digitalocean.com', category: 'Infrastructure', type: 'Website', tags: ['Cloud', 'Compute'], logoSlug: 'digitalocean', brandColor: '0080FF' },
  { id: 'aws', name: 'AWS', description: 'Comprehensive cloud platform for modern workloads.', descriptionCn: '覆盖现代工作负载的综合云平台。', url: 'https://aws.amazon.com', category: 'Infrastructure', type: 'Website', tags: ['Cloud', 'Scale'], logoSlug: 'amazonaws', logoUrl: 'https://aws.amazon.com/favicon.ico', brandColor: '232F3E' },
  { id: 'azure', name: 'Microsoft Azure', description: 'Enterprise cloud services for apps and data.', descriptionCn: '面向企业应用与数据的云服务平台。', url: 'https://azure.microsoft.com', category: 'Infrastructure', type: 'Website', tags: ['Enterprise', 'Cloud'], logoSlug: 'microsoftazure', logoUrl: 'https://azure.microsoft.com/favicon.ico', brandColor: '0078D4' },
  { id: 'gcp', name: 'Google Cloud', description: 'Cloud infrastructure and AI services from Google.', descriptionCn: '谷歌提供的云基础设施与 AI 服务。', url: 'https://cloud.google.com', category: 'Infrastructure', type: 'Website', tags: ['Cloud', 'AI'], logoSlug: 'googlecloud', brandColor: '4285F4' },
  { id: 'openai', name: 'OpenAI', description: 'Frontier AI research and deployment platform.', descriptionCn: '前沿 AI 研究与应用平台。', url: 'https://openai.com', category: 'AI', type: 'Website', tags: ['AI', 'Models'], logoSlug: 'openai', logoUrl: 'https://openai.com/favicon.ico', brandColor: '00A67E', featured: true },
  { id: 'huggingface', name: 'Hugging Face', description: 'AI model hub and open ML community.', descriptionCn: 'AI 模型中心与开源 ML 社区。', url: 'https://huggingface.co', category: 'AI', type: 'Website', tags: ['Models', 'Community'], logoSlug: 'huggingface', brandColor: 'FFD21E' },
  { id: 'midjourney', name: 'Midjourney', description: 'Generative AI for stunning images.', descriptionCn: '生成式 AI 图像创作平台。', url: 'https://www.midjourney.com', category: 'AI', type: 'Website', tags: ['Images', 'AI'], logoSlug: 'midjourney', logoUrl: 'https://www.midjourney.com/favicon.ico', brandColor: '000000' },
  { id: 'sentry', name: 'Sentry', description: 'Application monitoring and error tracking.', descriptionCn: '应用监控与错误追踪平台。', url: 'https://sentry.io', category: 'Dev', type: 'Website', tags: ['Monitoring', 'Errors'], logoSlug: 'sentry', brandColor: '362D59' },
  { id: 'postman', name: 'Postman', description: 'API collaboration and testing platform.', descriptionCn: 'API 协作与测试平台。', url: 'https://www.postman.com', category: 'Dev', type: 'Website', tags: ['API', 'Testing'], logoSlug: 'postman', brandColor: 'FF6C37' },
  { id: 'dockerhub', name: 'Docker Hub', description: 'Container image registry and discovery.', descriptionCn: '容器镜像仓库与发现平台。', url: 'https://hub.docker.com', category: 'Infrastructure', type: 'Website', tags: ['Containers', 'Registry'], logoSlug: 'docker', brandColor: '2496ED' },
  { id: 'gitlab', name: 'GitLab', description: 'End-to-end DevOps platform in one application.', descriptionCn: '一体化 DevOps 平台。', url: 'https://gitlab.com', category: 'Dev', type: 'Website', tags: ['DevOps', 'CI/CD'], logoSlug: 'gitlab', brandColor: 'FC6D26' },
  { id: 'jira', name: 'Jira', description: 'Issue tracking and agile project management.', descriptionCn: '敏捷项目管理与问题追踪工具。', url: 'https://www.atlassian.com/software/jira', category: 'Productivity', type: 'Website', tags: ['Agile', 'PM'], logoSlug: 'jira', brandColor: '0052CC' },
  { id: 'trello', name: 'Trello', description: 'Visual task management with boards and cards.', descriptionCn: '看板式任务管理平台。', url: 'https://trello.com', category: 'Productivity', type: 'Website', tags: ['Kanban', 'Tasks'], logoSlug: 'trello', brandColor: '0052CC' },
  { id: 'asana', name: 'Asana', description: 'Work management for teams and projects.', descriptionCn: '团队协作与项目管理平台。', url: 'https://asana.com', category: 'Productivity', type: 'Website', tags: ['Teams', 'PM'], logoSlug: 'asana', brandColor: 'F06A6A' },
  { id: 'slack', name: 'Slack', description: 'Team communication and collaboration hub.', descriptionCn: '团队沟通与协作枢纽。', url: 'https://slack.com', category: 'Social', type: 'Website', tags: ['Chat', 'Teams'], logoSlug: 'slack', logoUrl: 'https://slack.com/favicon.ico', brandColor: '4A154B' },
  { id: 'discord', name: 'Discord', description: 'Communities, voice chat, and live collaboration.', descriptionCn: '社区、语音与实时协作平台。', url: 'https://discord.com', category: 'Social', type: 'Website', tags: ['Community', 'Chat'], logoSlug: 'discord', brandColor: '5865F2' },
  { id: 'producthunt', name: 'Product Hunt', description: 'Discover the latest products and startups.', descriptionCn: '发现最新产品与创业项目。', url: 'https://www.producthunt.com', category: 'Social', type: 'Website', tags: ['Startups', 'Discovery'], logoSlug: 'producthunt', brandColor: 'DA552F' },
  { id: 'hackernews', name: 'Hacker News', description: 'Startup and tech community by Y Combinator.', descriptionCn: 'Y Combinator 技术与创业社区。', url: 'https://news.ycombinator.com', category: 'Social', type: 'Website', tags: ['Tech', 'News'], logoSlug: 'hackernews', logoUrl: 'https://news.ycombinator.com/favicon.ico', brandColor: 'FF6600' },

  // --- SOFTWARE ---
  { id: 'cursor', name: 'Cursor', description: 'The AI Code Editor.', descriptionCn: 'AI 代码编辑器。', url: 'https://cursor.com/', category: 'Dev', type: 'Software', tags: ['AI', 'IDE'], logoSlug: 'cursor', brandColor: '34D399', featured: true },
  { id: 'obsidian', name: 'Obsidian', description: 'A powerful knowledge base.', descriptionCn: '基于本地文件的强大知识库。', url: 'https://obsidian.md/', category: 'Productivity', type: 'Software', tags: ['Knowledge', 'Markdown'], logoSlug: 'obsidian', brandColor: '483699', featured: true },
  { id: 'raycast', name: 'Raycast', description: 'Blazingly fast launcher for macOS.', descriptionCn: 'macOS 上极速的启动器。', url: 'https://raycast.com/', category: 'Productivity', type: 'Software', tags: ['Launcher', 'MacOS'], logoSlug: 'raycast', brandColor: 'FF6363', featured: true },
  { id: 'vscode', name: 'Visual Studio Code', description: 'Lightweight yet powerful code editor.', descriptionCn: '轻量但强大的代码编辑器。', url: 'https://code.visualstudio.com/', category: 'Dev', type: 'Software', tags: ['IDE', 'Editor', '装机必备'], logoSlug: 'visualstudiocode', logoUrl: 'https://code.visualstudio.com/favicon.ico', brandColor: '007ACC', featured: true },
  { id: 'chrome', name: 'Google Chrome', description: 'Fast, secure, and simple web browser.', descriptionCn: '快速、安全、易用的浏览器。', url: 'https://www.google.com/chrome/', category: 'Productivity', type: 'Software', tags: ['Browser', '装机必备'], logoSlug: 'googlechrome', brandColor: '4285F4', featured: true },
  { id: 'firefox', name: 'Firefox', description: 'Privacy-focused browser by Mozilla.', descriptionCn: 'Mozilla 出品的隐私优先浏览器。', url: 'https://www.mozilla.org/firefox/', category: 'Productivity', type: 'Software', tags: ['Browser', 'Privacy', '装机必备'], logoSlug: 'firefoxbrowser', brandColor: 'FF7139' },
  { id: 'git', name: 'Git', description: 'Distributed version control system.', descriptionCn: '分布式版本控制系统。', url: 'https://git-scm.com/', category: 'Dev', type: 'Software', tags: ['Versioning', 'Dev', '装机必备'], logoSlug: 'git', brandColor: 'F05032' },
  { id: 'nodejs', name: 'Node.js', description: 'JavaScript runtime built on V8.', descriptionCn: '基于 V8 的 JavaScript 运行时。', url: 'https://nodejs.org/', category: 'Dev', type: 'Software', tags: ['Runtime', 'JavaScript', '装机必备'], logoSlug: 'nodedotjs', brandColor: '339933' },
  { id: 'docker-desktop', name: 'Docker Desktop', description: 'Container platform for local development.', descriptionCn: '本地开发的容器平台。', url: 'https://www.docker.com/products/docker-desktop/', category: 'Infrastructure', type: 'Software', tags: ['Containers', 'DevOps', '装机必备'], logoSlug: 'docker', brandColor: '2496ED' },
  { id: '7zip', name: '7-Zip', description: 'High-compression file archiver.', descriptionCn: '高压缩率文件管理工具。', url: 'https://www.7-zip.org/', category: 'Productivity', type: 'Software', tags: ['Compression', 'Utilities', '装机必备'], logoSlug: '7zip', brandColor: '000000' },
  { id: 'notepadpp', name: 'Notepad++', description: 'Lightweight text editor for Windows.', descriptionCn: '轻量级 Windows 文本编辑器。', url: 'https://notepad-plus-plus.org/', category: 'Productivity', type: 'Software', tags: ['Editor', 'Windows', '装机必备'], logoSlug: 'notepadplusplus', brandColor: '90E59A' },
  { id: 'vlc', name: 'VLC', description: 'Free and open-source media player.', descriptionCn: '开源免费多媒体播放器。', url: 'https://www.videolan.org/vlc/', category: 'Media', type: 'Software', tags: ['Player', 'Video', '装机必备'], logoSlug: 'vlcmediaplayer', brandColor: 'FF8800' },
  { id: 'powertoys', name: 'PowerToys', description: 'Windows power user utilities.', descriptionCn: 'Windows 高效工具集。', url: 'https://learn.microsoft.com/windows/powertoys/', category: 'Productivity', type: 'Software', tags: ['Windows', 'Utilities', '装机必备'], logoSlug: 'powertoys', logoUrl: 'https://learn.microsoft.com/favicon.ico', brandColor: '0099BC' },
  { id: 'windows-terminal', name: 'Windows Terminal', description: 'Modern terminal app for Windows.', descriptionCn: 'Windows 现代化终端应用。', url: 'https://aka.ms/terminal', category: 'Dev', type: 'Software', tags: ['Terminal', 'Windows', '装机必备'], logoSlug: 'windowsterminal', logoUrl: 'https://learn.microsoft.com/favicon.ico', brandColor: '4D4D4D' },
  { id: 'bitwarden', name: 'Bitwarden', description: 'Secure password manager.', descriptionCn: '安全可靠的密码管理器。', url: 'https://bitwarden.com/', category: 'Security', type: 'Software', tags: ['Password', 'Security', '装机必备'], logoSlug: 'bitwarden', brandColor: '175DDC' },
];

export default function DiscoveryPage() {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filterResources = (type: ResourceType) => {
    return DISCOVERY_RESOURCES.filter(res => {
      const isType = res.type === type;
      const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (res.descriptionCn && res.descriptionCn.includes(searchQuery)) ||
                            res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return isType && matchesSearch;
    });
  };

  const ResourceGrid = ({ type }: { type: ResourceType }) => {
    const items = filterResources(type);
    
    if (items.length === 0) {
      return (
        <RevealOnScroll direction="up">
          <div className="py-20 text-center glass rounded-[3rem] space-y-4 cyber-shimmer">
            <div className="text-6xl animate-bounce">🔭</div>
            <h2 className="text-2xl font-bold tracking-tight">{t.blog.noResults}</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">
              {t.blog.noResultsSub}
            </p>
          </div>
        </RevealOnScroll>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((res, i) => (
          <RevealOnScroll key={res.id} direction="up" delay={(i % 12) * 20}>
            <Card className="glass border-none rounded-[2.5rem] overflow-hidden group h-full card-hover shadow-xl flex flex-col cyber-shimmer">
              <div className="relative h-40 flex items-center justify-center p-10 overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20"
                  style={{ backgroundColor: `#${res.brandColor || '6366f1'}` }}
                />
                <div className="relative z-10 w-16 h-16 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                  <ResourceLogo logoSlug={res.logoSlug} logoUrl={res.logoUrl} name={res.name} />
                </div>
                
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary/20 text-primary backdrop-blur-md border-none px-3 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest">
                    {res.category}
                  </Badge>
                </div>
                {res.featured && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-500/20 text-yellow-600 p-1.5 rounded-full backdrop-blur-md border border-yellow-500/20">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
              
              <CardContent className="p-8 pt-2 flex flex-col flex-1 justify-between gap-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    {res.name}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed font-medium line-clamp-2 min-h-[2rem]">
                    {language === 'cn' && res.descriptionCn ? res.descriptionCn : res.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {res.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wide text-primary/90 bg-gradient-to-r from-primary/10 to-accent/40 border border-primary/20 shadow-sm ring-1 ring-primary/5 transition-colors hover:from-primary/20 hover:to-accent/60 hover:text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Link href={res.url} target="_blank" className="w-full">
                  <Button variant="outline" className="w-full h-10 rounded-xl gap-2 font-bold text-xs border-primary/10 hover:bg-primary/5">
                    {t.dashboard.visitSite} <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </RevealOnScroll>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8">
        <RevealOnScroll direction="left" className="space-y-3 flex-1">
          <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 font-bold uppercase tracking-widest text-[9px] cyber-shimmer">
            {t.dashboard.badge}
          </Badge>
          <h1 className="font-headline font-bold text-4xl md:text-6xl tracking-tighter leading-none">
            {t.dashboard.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl font-medium leading-relaxed">
            {t.dashboard.subtitle}
          </p>
        </RevealOnScroll>

        <RevealOnScroll direction="right" className="w-full lg:max-w-xs">
          <div className="relative group rounded-full surface p-1 cyber-shimmer">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" />
            <Input 
              className="rounded-full h-10 pl-10 pr-10 border-none bg-transparent focus-visible:ring-2 focus-visible:ring-primary text-sm"
              placeholder={t.dashboard.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                aria-label="clear"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </RevealOnScroll>
      </div>

      <div className="flex flex-col gap-12">
        <Tabs defaultValue="proxy" className="w-full space-y-12">
          <RevealOnScroll direction="up" className="flex justify-center">
            <TabsList className="bg-accent/40 p-1.5 rounded-full h-auto glass flex-wrap justify-center cyber-shimmer">
              <TabsTrigger value="proxy" className="rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary transition-all">
                <Shield className="w-3.5 h-3.5 mr-2" /> {t.dashboard.proxy}
              </TabsTrigger>
              <TabsTrigger value="linux" className="rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary transition-all">
                <Box className="w-3.5 h-3.5 mr-2" /> {t.dashboard.linux}
              </TabsTrigger>
              <TabsTrigger value="software" className="rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary transition-all">
                <Monitor className="w-3.5 h-3.5 mr-2" /> {t.dashboard.software}
              </TabsTrigger>
              <TabsTrigger value="website" className="rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary transition-all">
                <Globe className="w-3.5 h-3.5 mr-2" /> {t.dashboard.websites}
              </TabsTrigger>
              <TabsTrigger value="social" className="rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary transition-all">
                <Share2 className="w-3.5 h-3.5 mr-2" /> {t.dashboard.social}
              </TabsTrigger>
            </TabsList>
          </RevealOnScroll>

          <TabsContent value="proxy" className="mt-0 outline-none"><ResourceGrid type="Proxy" /></TabsContent>
          <TabsContent value="linux" className="mt-0 outline-none"><ResourceGrid type="Linux" /></TabsContent>
          <TabsContent value="software" className="mt-0 outline-none"><ResourceGrid type="Software" /></TabsContent>
          <TabsContent value="website" className="mt-0 outline-none"><ResourceGrid type="Website" /></TabsContent>
          <TabsContent value="social" className="mt-0 outline-none"><ResourceGrid type="Social" /></TabsContent>
        </Tabs>
      </div>

      <RevealOnScroll direction="up">
        <div className="glass rounded-[4rem] p-16 text-center relative overflow-hidden shadow-2xl mt-12 cyber-shimmer">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[25rem] h-[25rem] bg-primary/10 blur-[150px] rounded-full" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto animate-float shadow-inner">
              <Network className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter">
              {t.dashboard.syncTitle}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium max-w-xl mx-auto">
              {t.dashboard.syncSub}
            </p>
            <div className="pt-4">
              <Link href="/playground">
                <Button variant="outline" className="rounded-full h-12 px-8 font-bold uppercase tracking-widest text-[10px] border-primary/20 shadow-lg">
                  {t.dashboard.tryExperiments} <Zap className="ml-2 w-4 h-4 fill-primary text-primary" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
}
