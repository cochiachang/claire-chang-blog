var e=`---
title: K8S NodePort 高流量導致 ksoftirqd 佔滿 CPU 的原因與解法
description: 在 K8S 上架串流伺服器做壓力測試時，ksoftirqd 佔用大量 CPU 使 worker node 變慢。本文解析 IRQ、網路卡中斷原理，並示範透過 ingress-nginx 設定讓 NIC 以長連接處理串流，降低中斷負載。
date: 2023-05-10
category: DevOps
tags: [Kubernetes, ksoftirqd, IRQ, NodePort, ingress-nginx]
readingTime: 6 分鐘
image: /images/tech/hero_k8s-ksoftirqd-high-cpu.webp
imageAlt: Kubernetes 節點 CPU 負載監控圖表，顯示 ksoftirqd 高使用率
---


# K8S NodePort 高流量導致 ksoftirqd 佔滿 CPU 的原因與解法

在 K8S 內架設串流伺服器做 load test 時，發現流量一變高，ksoftirqd 就會佔掉非常大的 CPU 使用率，導致整個 worker node 變得緩慢。這篇文章整理這個問題的成因（NodePort 觸發的大量 IRQ 中斷）、背後的 IRQ 與網路卡原理，以及如何在 ingress 上正確設定串流的 MIME type，讓連線以長連接方式處理。

## 問題是什麼？為什麼 ksoftirqd 會吃掉 CPU？

我們在 K8S 內架設串流伺服器，在做 loadtest 時發現，當流量變高之後，K8S 用來管理線程的 cadvisor 所調用的 ksoftirqd 會占掉非常大的 CPU 使用率，並導致整個 worker node 變得緩慢：

![監控面板截圖，顯示 ksoftirqd 佔用大量 CPU 使用率](/images/articles/k8s-ksoftirqd-high-cpu-1.webp)

相關的問題說明請見 [Debugging network stalls on Kubernetes](https://github.blog/2019-11-21-debugging-network-stalls-on-kubernetes/)。

## 問題的形成原因是什麼？

這是因為當使用 Kubernetes 的 NodePort 來公開一個服務時，它會在每個工作節點上開放一個連接埠，讓外部可以連到該連接埠，並將流量轉發到服務的後端 Pod 上。當流量高峰期間，可能會導致節點的 CPU 負載增加，並產生大量的 IRQ 請求——因為每個資料包都會觸發一次 IRQ 請求。

## IRQ 是什麼？

IRQ 是中斷請求（Interrupt Request）的簡寫，是一種處理設備 I/O 操作的機制。當設備有 I/O 操作時，它會觸發一個中斷請求，通知作業系統或應用程式需要處理這個 I/O 操作。在網路通信中，每個資料包都會觸發一次 IRQ 請求，因此當流量高峰期間，大量的 IRQ 請求可能會導致節點的 CPU 負載增加，從而影響應用程式的效能。中斷請求通常由外部設備發出，例如鍵盤、滑鼠、網卡、磁碟控制器等。

IRQ 的實現涉及硬體和軟體兩個方面：

- **硬體方面**：通常需要在主板上預留一些專門的中斷請求線（IRQ lines），用於連接各種外設和 CPU。一般來說，一個計算機系統會有多個 IRQ lines，每條對應一個外設或一組相關的外設。
- **軟體方面**：作業系統需要透過中斷控制器來管理各條 IRQ lines，在接收到外設發出的中斷請求時及時響應。中斷控制器會將中斷請求轉發給 CPU，CPU 再執行相應的中斷處理程序來處理。

IRQ 是計算機硬體的設計決定。當網路適配器（NIC）接收到資料包時，它會發送一個中斷請求給處理器，通知處理器需要處理這個資料包。處理器收到 IRQ 後，會停止當前的任務，開始處理中斷請求，處理完後再返回之前的任務繼續執行。

## 網路適配器（NIC）是什麼？

網路適配器，也稱為網路介面卡（Network Interface Card，NIC），是計算機中用於實現網路通信的硬體設備之一。它通常安裝在計算機主板上，負責接收和發送網路資料包，可以連接到以太網、Wi-Fi、藍牙等不同類型的網路。

網路適配器的作用是將資料轉換為網路能夠識別和傳輸的格式，例如將資料包封裝成以太網幀以便在以太網上傳輸。同時它也負責監控網路上的資料流量，並在需要時觸發 IRQ 請求，通知處理器處理資料包。網路適配器的效能對網路通信的效率和吞吐量有很大影響——在高性能計算環境中，通常會選擇 10GbE、40GbE、100GbE 等高速網路適配器。

## 為什麼 K8S 的 IRQ 負載比一般 Linux 主機更明顯？

當一般主機傳輸大量流時，也會產生網路適配器的 IRQ 請求，但這種情況下的 IRQ 請求通常可以被系統有效地處理，不會對 CPU 負載產生太大影響。這是因為一般主機的網路適配器通常採用了更先進的中斷卸載技術，如 RSS（Receive Side Scaling）、RPS（Receive Packet Steering）等，可以將 IRQ 請求在多個 CPU 核心上分配，有效提高系統的網路吞吐量。

在 Kubernetes 中，由於每個節點上的 Pod 分佈不確定，無法像一般主機那樣進行有效的中斷卸載。此外，網路流量是從 NodePort 直接傳輸到 Pod，中間可能還需經過多個網路層，增加了系統的網路負載。因此，在高負載情況下，使用 NodePort 公開服務可能會導致大量 IRQ 請求，增加 CPU 的負載。為了解決這個問題，可以考慮使用負載均衡器（ingress）等技術，將流量轉發到多個節點上，降低單個節點的負載。

## 怎麼在 K8S 的 Ingress 上設定串流連線？

由於我們架設的伺服器是串流伺服器，原本在一般的 Linux 主機裡，我們會用 NGINX 做反向代理，讓主機知道現在的連接目標為串流，如下面的 nginx.conf 範例：

\`\`\`nginx
http {
    include       mime.types;
    default_type  application/octet-stream; #設定所傳輸的格式為串流
    sendfile        on;
}
\`\`\`

這樣當有人透過 http 去拉取串流時，NIC 就會採取長連接的方式去處理這條串流。但現在串流伺服器被移到 K8S 裡面，連線請求處理的地方會在 worker node 所在的 NIC 上，而不是在串流服務的 Pod 上處理。因此，即便我們在 Pod 裡面設定連線方式為串流，在 worker node 上面也不知道這件事。

所以必須在 K8S 的 ingress 裡面做進一步的設定。第一步要先了解自己的 K8S 的 ingress 是用什麼實作的，例如我們的 K8S 是用 kubernetes/ingress-nginx 實作的。設定介紹請見 [NGINX Configuration](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/)。

共有三種方式可以實作：

1. [ConfigMap](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/)：在 NGINX 中設置全局配置。
2. [Annotations](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/)：如果想針對特定 Ingress 規則做特定配置，使用這個。
3. [自訂模板](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/custom-template/)：當需要更具體的設置時使用，例如 [open_file_cache](https://nginx.org/en/docs/http/ngx_http_core_module.html#open_file_cache)、調整[監聽](https://nginx.org/en/docs/http/ngx_http_core_module.html#listen)選項、\`rcvbuf\`，或當無法透過 ConfigMap 更改配置時。

以下是一個使用 types 設置 MIME 類型的示例：

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/server-snippet: |
      types {
        text/html                             html htm shtml;
        text/css                              css;
        text/xml                              xml;
        image/gif                             gif;
        image/jpeg                            jpeg jpg;
        application/javascript               js;
        application/atom+xml                  atom;
        application/rss+xml                   rss;
        text/mathml                           mml;
        text/plain                            txt;
        text/vnd.sun.j2me.app-descriptor      jad;
        text/vnd.wap.wml                      wml;
        text/x-component                      htc;
        image/png                             png;
        image/tiff                            tif tiff;
        image/vnd.wap.wbmp                    wbmp;
        image/x-icon                          ico;
        image/x-jng                           jng;
        image/x-ms-bmp                        bmp;
        image/svg+xml                         svg svgz;
        image/webp                            webp;
        application/font-woff                 woff;
        application/font-woff2                woff2;
        application/vnd.ms-fontobject         eot;
        application/x-font-ttf                ttc ttf;
        application/x-httpd-php               php;
        application/x-shockwave-flash         swf;
        application/json                      json;
        application/octet-stream              flv; #這邊可以設定MINE TYPE
      }
spec:
  rules:
    - host: example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-service
                port:
                  name: http
\`\`\`

這樣就可以正確地在 ingress 處理串流的連接了！

## 常見問題

### ksoftirqd 是什麼？為什麼會吃 CPU？

ksoftirqd 是 Linux 核心中處理軟體中斷（softirq）的核心線程。當網路資料包量非常大、中斷處理來不及時，softirq 會交給 ksoftirqd 處理，流量越高它的 CPU 佔用就越大。

### 為什麼 NodePort 模式特別容易觸發這個問題？

NodePort 會在每個 worker node 上開放連接埠接收流量，每個資料包都會觸發一次 IRQ，而 K8S 環境下 Pod 分佈不確定、難以做 RSS/RPS 等中斷卸載，導致中斷集中在單一節點上。

### 在 K8S 中如何讓串流連線被正確識別？

串流伺服器搬進 K8S 後，連線處理發生在 worker node 的 NIC，Pod 內的設定對節點無效。需要在 ingress（如 ingress-nginx）透過 ConfigMap、Annotations 或自訂模板設定 MIME type，讓 NIC 以長連接方式處理串流。

### ingress-nginx 有哪三種自訂設定的方式？

ConfigMap（全域配置）、Annotations（單一 Ingress 規則的配置）、自訂模板（需要更細緻的設定，如 open_file_cache、監聽選項、rcvbuf 時使用）。

## 參考資料

- [Debugging network stalls on Kubernetes - GitHub Blog](https://github.blog/2019-11-21-debugging-network-stalls-on-kubernetes/)
- [NGINX Configuration - Ingress-Nginx Controller](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/)
- [Annotations - Ingress-Nginx Controller](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet)
- [Custom Headers - Ingress-Nginx Controller](https://kubernetes.github.io/ingress-nginx/examples/customization/custom-headers/)

## 延伸閱讀

- [K8S裡CPU和MEMORY的計算單位](/post/kubernetes-cpu-memory-units)：同樣聚焦 Kubernetes，可接著比較不同情境的做法。
- [在 K8S 內 Node.js 紀錄 log 的解決方案](/post/k8s-nodejs-logging-solution)：同樣聚焦 Kubernetes，可接著比較不同情境的做法。
- [Helm 是什麼？Kubernetes 套件管理器安裝與部署 Chart 實作筆記](/post/helm-deploy-k8s)：同樣聚焦 Kubernetes，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-05-10，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};