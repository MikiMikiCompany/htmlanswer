import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * 英語の文法解説（English_v2 が answers に subject=english / target=「文法解説（名前）」で配信）を
 * ちゃんと読んだかどうかの閲覧ログを取る。
 *
 * 解説1問ぶんの枠（.problem-box）ごとに「画面に映っていた時間」を、画面に占める割合で按分して
 * 積み上げ、ページをどこまでスクロールしたかと合わせて answers/{id}.readingSessions.{sessionId}
 * に保存する。判定（サボりかどうか）は English_v2 の日次ルーティーンが翌日以降にまとめて行う。
 */

const TICK_MS = 1000;
const FLUSH_EVERY_TICKS = 10;
// 操作（スクロール・タップ等）がこれ以上無い間は、開きっぱなしとみなして時間を数えない
const IDLE_LIMIT_MS = 90_000;

interface BoxStat {
  index: number;
  charCount: number;
  visibleSec: number;
}

export function isEnglishGrammarExplanation(data: { subject?: unknown; target?: unknown }): boolean {
  return data.subject === 'english' && typeof data.target === 'string' && data.target.startsWith('文法解説');
}

function newSessionId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useReadingTelemetry(
  answerId: string | undefined,
  enabled: boolean,
  iframeRef: RefObject<HTMLIFrameElement | null>,
  contentKey: string,
) {
  const sessionIdRef = useRef<string>(newSessionId());

  useEffect(() => {
    if (!answerId || !enabled || !contentKey) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const docRef = doc(db, 'answers', answerId);
    const sessionId = sessionIdRef.current;
    const openedAt = new Date().toISOString();

    let boxes: HTMLElement[] = [];
    let stats: BoxStat[] = [];
    let activeSec = 0;
    let maxScrollRatio = 0;
    let lastActivity = Date.now();
    let tickCount = 0;
    let dirty = false;
    let detachActivity: (() => void) | null = null;

    const markActivity = () => {
      lastActivity = Date.now();
    };

    const attach = () => {
      const idoc = iframe.contentDocument;
      const iwin = iframe.contentWindow;
      if (!idoc || !iwin) return;
      detachActivity?.();
      boxes = Array.from(idoc.querySelectorAll<HTMLElement>('.problem-box'));
      stats = boxes.map((el, index) => ({
        index,
        charCount: (el.innerText || el.textContent || '').replace(/\s/g, '').length,
        visibleSec: 0,
      }));
      const events = ['scroll', 'touchstart', 'touchmove', 'mousemove', 'keydown', 'wheel'];
      events.forEach((e) => iwin.addEventListener(e, markActivity, { passive: true }));
      detachActivity = () => events.forEach((e) => iwin.removeEventListener(e, markActivity));
      markActivity();
    };

    const tick = () => {
      const idoc = iframe.contentDocument;
      const iwin = iframe.contentWindow;
      if (!idoc || !iwin || boxes.length === 0) return;
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastActivity > IDLE_LIMIT_MS) return;

      const vh = iwin.innerHeight;
      if (vh <= 0) return;
      const dt = TICK_MS / 1000;
      activeSec += dt;
      boxes.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
        stats[i].visibleSec += (dt * visible) / vh;
      });
      const scrollHeight = idoc.documentElement.scrollHeight || 1;
      maxScrollRatio = Math.max(maxScrollRatio, Math.min(1, (iwin.scrollY + vh) / scrollHeight));
      dirty = true;

      tickCount += 1;
      if (tickCount % FLUSH_EVERY_TICKS === 0) flush();
    };

    const flush = () => {
      if (!dirty || stats.length === 0) return;
      dirty = false;
      const session = {
        openedAt,
        updatedAt: new Date().toISOString(),
        activeSec: Math.round(activeSec),
        maxScrollRatio: Math.round(maxScrollRatio * 100) / 100,
        boxes: stats.map((s) => ({ ...s, visibleSec: Math.round(s.visibleSec * 10) / 10 })),
      };
      updateDoc(docRef, { [`readingSessions.${sessionId}`]: session }).catch((err) =>
        console.error('Failed to save reading telemetry:', err),
      );
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
      else markActivity();
    };

    if (iframe.contentDocument?.readyState === 'complete') attach();
    iframe.addEventListener('load', attach);
    const timer = window.setInterval(tick, TICK_MS);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flush);

    return () => {
      window.clearInterval(timer);
      iframe.removeEventListener('load', attach);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flush);
      detachActivity?.();
      flush();
    };
  }, [answerId, enabled, iframeRef, contentKey]);
}
