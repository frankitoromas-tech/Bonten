'use client';
import { useState, useEffect } from 'react';
import { INITIAL_DEBATES } from '@/data/debates';
import type { Debate, DebateArgument, ReactionType, ArgumentStance } from '@/types';
import { useToast } from '@/components/ui/Toast';

const STORAGE_KEY = 'bonten:debates';

export function useDebatesState() {
  const [debates, setDebates] = useState<Debate[]>(INITIAL_DEBATES);
  const [hydrated, setHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDebates(JSON.parse(saved) as Debate[]);
    } catch {
      /* almacenamiento no disponible */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(debates));
    } catch {
      /* sin persistencia disponible */
    }
  }, [debates, hydrated]);

  const handleReaction = (debateId: number, argId: number, reactionType: ReactionType) => {
    let actionDone: 'voted' | 'removed' = 'voted';
    setDebates((prev) =>
      prev.map((d) => {
        if (d.id !== debateId) return d;
        return {
          ...d,
          arguments: d.arguments.map((arg) => {
            if (arg.id !== argId) return arg;
            const hasReacted = arg.userReactions.includes(reactionType);
            actionDone = hasReacted ? 'removed' : 'voted';
            const userReactions = hasReacted
              ? arg.userReactions.filter((r) => r !== reactionType)
              : [...arg.userReactions, reactionType];
            const reactions = {
              ...arg.reactions,
              [reactionType]: Math.max(0, arg.reactions[reactionType] + (hasReacted ? -1 : 1)),
            };
            return { ...arg, reactions, userReactions };
          }),
        };
      })
    );
    showToast(actionDone === 'voted' ? '¡Reacción registrada!' : 'Reacción retirada', 'info');
  };

  const handleAddOpinion = (debateId: number, author: string, type: ArgumentStance, text: string) => {
    const newArgument: DebateArgument = {
      id: Date.now(),
      author,
      role: 'Invitado',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      roleClass: 'role-contributor',
      type,
      text,
      reactions: { solido: 0, persuasivo: 0, respetuoso: 0 },
      userReactions: [],
    };

    setDebates((prev) =>
      prev.map((d) =>
        d.id !== debateId
          ? d
          : { ...d, commentsCount: d.commentsCount + 1, arguments: [...d.arguments, newArgument] }
      )
    );

    showToast('¡Tu opinión ha sido añadida al debate!', 'success');
  };

  return { debates, handleReaction, handleAddOpinion };
}
