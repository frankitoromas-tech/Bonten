import type { Debate } from '@/types';

// Nota: las rutas de avatar apuntan a los .webp reales de /public/assets
// (antes referenciaban .png inexistentes, provocando imágenes rotas).
export const INITIAL_DEBATES: Debate[] = [
  {
    id: 1,
    title: 'La línea temporal actual y la criminalización de la vida',
    description:
      '¿Es hoy más difícil que antes defender los valores esenciales y la vida humana sin ser tachados de rebeldes o sombras?',
    tag: 'Sociedad',
    commentsCount: 3,
    voters: 45,
    arguments: [
      {
        id: 101,
        author: 'Carlos M.',
        role: 'Investigador',
        avatar: '/assets/avatar_carlos_1781465414008.webp',
        roleClass: 'role-investigator',
        type: 'pro',
        text: 'La historia demuestra que cuando los imperios se desgastan moralmente, criminalizan a quienes custodian la verdad. Hoy en día, defender la vida se empaqueta como una postura retrógrada cuando en realidad es el acto de resistencia más puro frente a un nihilismo de consumo.',
        reactions: { solido: 12, persuasivo: 8, respetuoso: 10 },
        userReactions: [],
      },
      {
        id: 102,
        author: 'Julián V. (Crítico)',
        role: 'Invitado',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        roleClass: 'role-contributor',
        type: 'contra',
        text: "No es criminalización de la vida, sino el progreso de las libertades individuales. Lo que algunos llaman 'resistencia' a veces es solo la dificultad de adaptarse a una sociedad pluralista que decide democráticamente sus propios límites éticos.",
        reactions: { solido: 4, persuasivo: 7, respetuoso: 3 },
        userReactions: [],
      },
      {
        id: 103,
        author: 'Ana L.',
        role: 'Moderadora',
        avatar: '/assets/avatar_ana_1781465403711.webp',
        roleClass: 'role-mod',
        type: 'pro',
        text: 'Es vital matizar: no se trata de imponer un dogma, sino de recordar que hay axiomas morales objetivos. Si el derecho más fundamental (la existencia) se vuelve negociable bajo conveniencia democrática, toda la estructura de derechos humanos se desmorona.',
        reactions: { solido: 15, persuasivo: 9, respetuoso: 14 },
        userReactions: [],
      },
    ],
  },
  {
    id: 2,
    title: 'La fe y la razón en la apologética del siglo XXI',
    description:
      '¿Deben la ciencia moderna y el pensamiento racional ser vistos como adversarios de la fe, o son herramientas complementarias?',
    tag: 'Apologética',
    commentsCount: 2,
    voters: 38,
    arguments: [
      {
        id: 201,
        author: 'Elena R.',
        role: 'Contribuidora',
        avatar: '/assets/avatar_elena_1781465424361.webp',
        roleClass: 'role-contributor',
        type: 'pro',
        text: 'La apologética moderna no debe temer a la ciencia. Cuanto más comprendemos la complejidad del cosmos y la precisión de sus constantes físicas, más fuerte es el argumento teleológico. La razón es la aliada natural de la revelación.',
        reactions: { solido: 18, persuasivo: 11, respetuoso: 10 },
        userReactions: [],
      },
      {
        id: 202,
        author: 'Dr. Tomás K.',
        role: 'Invitado',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        roleClass: 'role-investigator',
        type: 'contra',
        text: 'La ciencia opera bajo el naturalismo metodológico. Intentar forzar la ciencia para validar dogmas de fe suele resultar en mala ciencia o en una fe vulnerable a los constantes cambios del conocimiento empírico. Deben mantenerse en esferas separadas.',
        reactions: { solido: 8, persuasivo: 5, respetuoso: 12 },
        userReactions: [],
      },
    ],
  },
  {
    id: 3,
    title: 'Análisis exegético del concepto de la Gracia',
    description:
      'Estudio de las traducciones bíblicas y la interpretación doctrinal en las iglesias reformadas vs la exégesis católica.',
    tag: 'Teología',
    commentsCount: 1,
    voters: 22,
    arguments: [
      {
        id: 301,
        author: 'Ana L.',
        role: 'Moderadora',
        avatar: '/assets/avatar_ana_1781465403711.webp',
        roleClass: 'role-mod',
        type: 'pro',
        text: "El vocablo griego 'Charis' es radical. En las cartas paulinas, denota un favor inmerecido absoluto. Estudiar su raíz lingüística nos ayuda a desmantelar la idea del esfuerzo o mérito humano como moneda de cambio para la salvación divina.",
        reactions: { solido: 10, persuasivo: 6, respetuoso: 8 },
        userReactions: [],
      },
    ],
  },
];

export const DEBATE_TAGS = ['Todos', 'Sociedad', 'Apologética', 'Teología'] as const;
