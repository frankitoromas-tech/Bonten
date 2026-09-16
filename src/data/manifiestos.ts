import type { Manifiesto } from '@/types';

// Contenido doctrinal servido en /manifiestos/[slug].
export const MANIFIESTOS: Manifiesto[] = [
  {
    slug: 'posmodernidad',
    title: 'El bullying como fenómeno normativo del cuerpo',
    summary:
      'Una aproximación foucaultiana y feminista para entender cómo el sistema patriarcal y capitalista inscribe la violencia y normatividad directamente sobre los cuerpos en los espacios de socialización.',
    content: [
      'Si bien el bullying suele definirse convencionalmente como un comportamiento violento e intimidatorio en el ámbito escolar, este trabajo busca expandir el concepto para entenderlo como un fenómeno normativo arraigado en la cultura. Es decir, un comportamiento violento ejercido por diversos individuos de una sociedad e implantado en la psique colectiva por el sistema político.',
      'El feminismo, como movimiento ideológico, busca suprimir la violencia dirigida a toda persona. Rita Segato permite explicar la forma de dominación colonial eurocéntrica que normatiza una estructura patriarcal. Este sistema teje una red de percepciones de la realidad que dictan cómo relacionarse en el mundo.',
      '<blockquote>"El patriarcado como sistema político es estructuralmente la primera forma de desigualdad, de usurpación del poder, prestigio, autoridad y soberanía." — Rita Segato</blockquote>',
      'El género como estructura desigual es ya en sí misma violencia. Obliga y universaliza una forma de ser y se encarna en el cuerpo. Judith Butler afirma que "las estructuras jurídicas del lenguaje y de la política crean el campo actual de poder". Este control genera un rechazo tajante a lo diferente.',
      'Cuando este rechazo se suma al "capitalismo salvaje" moderno que promueve una batalla encarnizada por el "éxito", se vuelve violento e implanta un carácter normatizante. Justifica así la dialéctica del opresor y el oprimido (Gorgias), donde una "normalidad" ostenta preeminencia sobre otra.',
      'Por tanto, el fenómeno del bullying responde a esta estructura patriarcal que consolida una cultura opresora. En el espacio escolar, es la manifestación temprana del rechazo violento hacia lo diferente, reforzado por el mandato de consumo.',
      '<strong>Conclusión</strong><br/>El bullying es un epifenómeno surgido de la política patriarcal que instaura formas fijas de ser y crea dispositivos de poder para perpetuarse (la industria de conflictos lucrativos).',
      '<blockquote>¿Es posible salir del yugo de la opresión? Es posible si se cambia el discurso normalizante y totalizante por un discurso de pluralidad y diversidad, reconociendo que no hay una única forma de ser humano ni una única forma de manifestar nuestro ser en el mundo.</blockquote>',
      'Esto requerirá no solo cambiar nuestra subjetividad, sino desmantelar el sistema económico utilitarista que perpetúa estas lógicas destructivas.'
    ],
  },
  {
    slug: 'fundamentos',
    title: 'Fundamentos del Bloque Provida',
    summary:
      'Una exégesis sobre por qué la resistencia contemporánea requiere una base sólida en principios inmutables.',
    content: [
      'La resistencia sin fundamento es mera reacción. <strong>BONTEN parte de principios que no se negocian con la moda del siglo</strong>: la dignidad de la vida, la autoridad de las escrituras y la responsabilidad de custodiar la verdad.',
      '<blockquote>No construimos sobre arena. Construimos sobre la roca de aquello que ha resistido siglos de embate cultural.</blockquote>',
      'El Bloque Provida no es una etiqueta política, sino una postura hermenéutica y ética: defender la dignidad inalienable de la vida humana desde su concepción, fundamentar la razón frente al relativismo moral y actuar con firmeza.',
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
