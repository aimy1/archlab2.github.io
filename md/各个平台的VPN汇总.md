---
title: 👉各个平台的VPN汇总👈
date: 2025-06-10 18:58:46
categories: [Network]
tags: [VPN, Tools]
---
---
#  常见 VPN 服务大全
<p align="center">
还有不少冷门的没加
</p>

## windows
| 工具名称         | 协议支持                 | 官网 / 项目地址                                                              | 备注                |
| ------------ | -------------------- | ---------------------------------------------------------------------- | ----------------- |
| V2Ray / Xray | VMess, VLESS, Trojan | [v2fly.org](https://www.v2fly.org)                                     | CLI+多客户端支持        |
| Shadowsocks  | SOCKS5               | [github.com/shadowsocks](https://github.com/shadowsocks)               | 轻量稳定              |
| Trojan-GFW   | HTTPS(TLS)           | [github.com/trojan-gfw](https://github.com/trojan-gfw)                 | 抗封锁能力强            |
| NaiveProxy   | HTTPS (HTTP/3)       | [github.com/klzgrad/naiveproxy](https://github.com/klzgrad/naiveproxy) | 伪装性强，使用Chrome网络堆栈 |
| Hysteria     | QUIC, UDP            | [github.com/apernet/hysteria](https://github.com/apernet/hysteria)     | UDP协议，抗封锁优        |
| TUIC         | QUIC, HTTP/3         | [github.com/EAimTY/tuic](https://github.com/EAimTY/tuic)               | 低延迟               |
| Brook        | 自定义协议                | [github.com/txthinking/brook](https://github.com/txthinking/brook)     | 快速部署              |
| Sing-box     | 多协议                  | [sing-box.sagernet.org](https://sing-box.sagernet.org)                 | 新兴替代方案            |

---
## Android
| 工具名称                | 协议支持                 | 官网 / 项目地址                                                              | 备注        |
| ------------------- | -------------------- | ---------------------------------------------------------------------- | --------- |
| V2RayNG (客户端)       | VMess, VLESS, Trojan | [v2rayng.org](https://github.com/2dust/v2rayNG)                        | 主流安卓客户端   |
| Shadowsocks         | SOCKS5               | [github.com/shadowsocks](https://github.com/shadowsocks)               | 多版本，轻量    |
| Trojan-Android      | HTTPS (TLS)          | [github.com/trojan-gfw](https://github.com/trojan-gfw)                 | 稳定，抗封     |
| NaiveProxy (第三方客户端) | HTTPS (HTTP/3)       | [github.com/klzgrad/naiveproxy](https://github.com/klzgrad/naiveproxy) | 需额外客户端    |
| Hysteria            | QUIC, UDP            | [github.com/apernet/hysteria](https://github.com/apernet/hysteria)     | UDP协议，高性能 |
| Brook               | 自定义协议                | [github.com/txthinking/brook](https://github.com/txthinking/brook)     | 简单        |
| Sing-box (客户端)      | 多协议                  | [sing-box.sagernet.org](https://sing-box.sagernet.org)                 | 现代多协议客户端  |

---
## Linux
| 工具名称         | 协议支持                 | 发行版支持                                                    | 官网 / 项目地址                                                              | 备注          |
| ------------ | -------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------- | ----------- |
| V2Ray / Xray | VMess, VLESS, Trojan | Ubuntu/Debian (APT), Arch (AUR), CentOS, Alpine, OpenWrt | [v2fly.org](https://www.v2fly.org)                                     | 官方多平台包，社区活跃 |
| Shadowsocks  | SOCKS5               | Ubuntu/Debian, Arch, CentOS, Alpine, OpenWrt             | [github.com/shadowsocks](https://github.com/shadowsocks)               | 轻量，广泛支持     |
| Trojan-GFW   | HTTPS (TLS)          | Ubuntu/Debian, Arch, CentOS, Alpine (部分)                 | [github.com/trojan-gfw](https://github.com/trojan-gfw)                 | 抗封锁强        |
| NaiveProxy   | HTTPS (HTTP/3)       | 需源码编译，支持主流发行版                                            | [github.com/klzgrad/naiveproxy](https://github.com/klzgrad/naiveproxy) | 伪装性极强       |
| Hysteria     | QUIC, UDP            | Ubuntu/Debian, Arch, CentOS, Alpine, OpenWrt             | [github.com/apernet/hysteria](https://github.com/apernet/hysteria)     | 重点UDP，抗封性能好 |
| TUIC         | QUIC, HTTP/3         | Ubuntu/Debian, Arch, CentOS (部分), Alpine (手动)            | [github.com/EAimTY/tuic](https://github.com/EAimTY/tuic)               | 高性能低延迟      |
| Brook        | 自定义协议                | Ubuntu/Debian, Arch, CentOS, Alpine, OpenWrt             | [github.com/txthinking/brook](https://github.com/txthinking/brook)     | 轻量简单        |
| Sing-box     | 多协议                  | Ubuntu/Debian, Arch, CentOS, Alpine, OpenWrt             | [sing-box.sagernet.org](https://sing-box.sagernet.org)                 | 新兴多协议替代方案   |

---
## iOS
| 工具名称                | 协议支持                                | 官网 / 项目地址                                                                      | 备注              |
| ------------------- | ----------------------------------- | ------------------------------------------------------------------------------ | --------------- |
| Shadowrocket        | 多协议支持 (VMess, Shadowsocks, Trojan等) | [apps.apple.com](https://apps.apple.com/cn/app/shadowrocket/id932747118) (付费)  | 主流代理工具          |
| Quantumult X        | 多协议支持                               | [apps.apple.com](https://apps.apple.com/cn/app/quantumult-x/id1443988620) (付费) | 高级代理配置          |
| Kitsunebi           | VMess, VLESS                        | [kitsuapp.com](https://kitsuapp.com)                                           | 轻量客户端           |
| Shadowsocks-iOS     | SOCKS5                              | [github.com/shadowsocks](https://github.com/shadowsocks/shadowsocks-iOS)       | 开源免费            |
| Trojan-GFW iOS      | HTTPS (TLS)                         | 需配置第三方客户端                                                                      | 需通过TestFlight安装 |
| NaiveProxy (第三方客户端) | HTTPS (HTTP/3)                      | 需配置第三方客户端                                                                      | 较冷门             |
| Sing-box (客户端)      | 多协议                                 | [sing-box.sagernet.org](https://sing-box.sagernet.org)                         | 新兴多协议客户端        |

---
## macOS
| 工具名称         | 协议支持                 | 官网 / 项目地址                                                              | 备注              |
| ------------ | -------------------- | ---------------------------------------------------------------------- | --------------- |
| V2Ray / Xray | VMess, VLESS, Trojan | [v2fly.org](https://www.v2fly.org)                                     | 支持多客户端，命令行或 GUI |
| Shadowsocks  | SOCKS5               | [github.com/shadowsocks](https://github.com/shadowsocks)               | 多客户端支持          |
| Trojan-GFW   | HTTPS (TLS)          | [github.com/trojan-gfw](https://github.com/trojan-gfw)                 | 抗封锁             |
| NaiveProxy   | HTTPS (HTTP/3)       | [github.com/klzgrad/naiveproxy](https://github.com/klzgrad/naiveproxy) | 需要较新系统          |
| Hysteria     | QUIC, UDP            | [github.com/apernet/hysteria](https://github.com/apernet/hysteria)     | UDP协议优          |
| TUIC         | QUIC, HTTP/3         | [github.com/EAimTY/tuic](https://github.com/EAimTY/tuic)               | 适合低延迟           |
| Brook        | 自定义协议                | [github.com/txthinking/brook](https://github.com/txthinking/brook)     | 轻量简单            |
| Sing-box     | 多协议                  | [sing-box.sagernet.org](https://sing-box.sagernet.org)                 | 新兴方案            |

---
## 第三方服务
| VPN 名称         | 类型       | 免费版 | 支持平台             |
|------------------|------------|--------|----------------------|
| [NordVPN](https://nordvpn.com)           | 商业VPN   | 否     | Windows, macOS, Linux, Android, iOS |
| [ExpressVPN](https://www.expressvpn.com) | 商业VPN   | 否     | 全平台                 |
| [Surfshark](https://surfshark.com)       | 商业VPN   | 否     | 全平台                 |
| [CyberGhost](https://www.cyberghostvpn.com) | 商业VPN   | 否     | 全平台                 |
| [ProtonVPN](https://protonvpn.com)       | 商业+免费 | 是     | 全平台                 |
| [Windscribe](https://windscribe.com)     | 商业+免费 | 是     | 全平台                 |
| [TunnelBear](https://www.tunnelbear.com) | 商业+免费 | 是     | 全平台                 |
| [AtlasVPN](https://atlasvpn.com)         | 商业+免费 | 是     | Windows, Android, iOS |
| [Private Internet Access](https://www.privateinternetaccess.com) | 商业VPN | 否     | 全平台                 |
| [Mullvad](https://mullvad.net)           | 商业VPN   | 否     | 全平台                 |
| [Hide.me](https://hide.me)               | 商业+免费 | 是     | 全平台                 |
| [Hotspot Shield](https://www.hotspotshield.com) | 商业+免费 | 是     | 全平台                 |
| [PrivadoVPN](https://privadovpn.com)     | 商业+免费 | 是     | Windows, macOS, Android, iOS |
| [Betternet](https://www.betternet.co)    | 商业+免费 | 是     | Windows, iOS, Android |