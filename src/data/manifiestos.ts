import type { Manifiesto } from '@/types';

// Contenido doctrinal servido en /manifiestos/[slug].
// Antes estos enlaces apuntaban a rutas inexistentes (404).
export const MANIFIESTOS: Manifiesto[] = [
  {
    slug: 'fundamentos',
    title: 'Fundamentos del Bloque Protestante',
    summary:
      'Una exégesis sobre por qué la resistencia contemporánea requiere una base sólida en principios inmutables.',
    content: [
      'La resistencia sin fundamento es mera reacción. <strong>BONTEN parte de principios que no se negocian con la moda del siglo</strong>: la dignidad de la vida, la autoridad de las escrituras y la responsabilidad de custodiar la verdad.',
      '<blockquote>No construimos sobre arena. Construimos sobre la roca de aquello que ha resistido siglos de embate cultural.</blockquote>',
      'El Bloque Protestante no es una etiqueta política, sino una postura hermenéutica: leer la realidad a la luz de un texto que nos precede y nos corrige. De ahí nace nuestra firmeza.',
      'Invitamos a cada integrante a estudiar estos fundamentos antes de participar en los debates. La convicción se sostiene en el conocimiento, no en la emoción del momento.',
    ],
  },
  {
    slug: 'etica',
    title: 'La Ética en la Era de la Desinformación',
    summary:
      'Cómo mantener el criterio de verdad cuando las estructuras mediáticas dictan lo contrario.',
    content: [
      'Vivimos rodeados de ruido. La desinformación no es solo falsedad: es la erosión sistemática de la capacidad de discernir. <strong>Nuestra ética empieza por recuperar el criterio.</strong>',
      'Frente al relativismo que iguala toda opinión, sostenemos que existen axiomas morales objetivos. No todo vale, y no toda narrativa merece el mismo peso.',
      '<blockquote>La verdad no depende del número de veces que se repite una mentira.</blockquote>',
      'Este manifiesto propone tres disciplinas: verificar antes de compartir, argumentar antes de reaccionar, y respetar antes de refutar. La resistencia intelectual es, ante todo, una resistencia ética.',
    ],
  },
];

export function getManifiesto(slug: string): Manifiesto | undefined {
  return MANIFIESTOS.find((m) => m.slug === slug);
}
