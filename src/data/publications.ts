import type { MemberPublication } from '@/types';

/**
 * Repositorio desacoplado de publicaciones, ensayos y disquisiciones doctrinales
 * asociadas a cada integrante de la Mesa Directiva de BONTEN.
 */
export const MEMBER_PUBLICATIONS: Record<string, MemberPublication> = {
  fireboy: {
    title: 'La Necesidad Ineludible de la Resistencia Intelectual',
    category: 'Apologética & Principios Fundacionales',
    date: '10 de septiembre de 2026',
    readTime: '4 min de lectura',
    subtitle: 'Por qué la confrontación de ideas es el deber supremo de nuestra época',
    summary: 'Una disección sobre la pasividad cultural contemporánea y el llamado a levantar una voz inquebrantable en defensa de la verdad objetiva.',
    paragraphs: [
      'El letargo del pensamiento es la antesala de la sumisión cultural. En una sociedad que premia el consenso hueco por encima de la verdad, cuestionar los dogmas mediáticos no es una opción de disidencia: es una obligación moral irreductible.',
      '<blockquote>No nos conformamos con el eco de lo políticamente correcto. Existimos para encender el debate donde otros imponen el silencio.</blockquote>',
      'BONTEN nace precisamente en ese cruce histórico: como un bastión para quienes no temen pensar con rigor, fundamentar sus convicciones con datos y principios inmutables, y liderar la resistencia en la plaza pública digital.',
      'El conocimiento no es un adorno académico; es la espada con la que se desarman las falacias y se rescata la dignidad de la vida.',
    ],
  },
  daniel: {
    title: 'Bases Ontológicas y Éticas de la Defensa de la Vida',
    category: 'Bioética & Filosofía del Derecho',
    date: '11 de septiembre de 2026',
    readTime: '3 min de lectura',
    subtitle: 'La dignidad del ser humano como límite infranqueable al arbitrio estatal',
    summary: 'Análisis sobre cómo el derecho natural y la evidencia biológica fundamentan la personalidad jurídica de todo individuo de la especie humana.',
    paragraphs: [
      'El valor del ser humano no proviene de una concesión legal ni de la utilidad que reporte a un sistema económico o político. Radica en su propia naturaleza intrínseca.',
      '<blockquote>Toda sociedad que condiciona la dignidad humana a la etapa de desarrollo o al grado de autonomía termina justificando la tiranía del fuerte sobre el indefenso.</blockquote>',
      'Frente a las corrientes utilitaristas que degradan la existencia a una función de conveniencia, la ética pro-vida sostiene un principio universal: la vida humana es inviolable en todo momento y circunstancia.',
    ],
  },
  mijail: {
    title: 'Desmontando Falacias: Dialéctica y Rigor en el Discurso Público',
    category: 'Lógica & Crítica Cultural',
    date: '08 de septiembre de 2026',
    readTime: '4 min de lectura',
    subtitle: 'Herramientas para identificar y refutar sofismas contemporáneos',
    summary: 'Un manual analítico para desenmascarar argumentos emocionales y sesgos cognitivos en los debates ideológicos de nuestro tiempo.',
    paragraphs: [
      'En la era de la hiperconexión, las falacias proliferan con la velocidad de un algoritmo. El ataque ad hominem, el falso dilema y el hombre de paja se han normalizado como sustitutos del pensamiento.',
      '<blockquote>El debate honesto no busca humillar al interlocutor, sino demoler la mentira para que la verdad resplandezca por su propio peso.</blockquote>',
      'Analizar la realidad desde una perspectiva crítica exige rigor metodológico: verificar premisas, rastrear fuentes primarias y jamás subordinar la evidencia empírica al sentimiento colectivo.',
    ],
  },
  ilan: {
    title: 'Sócrates sobre el placer, la virtud y el bien',
    category: 'Disquisiciones Filosóficas',
    date: '12 de septiembre de 2026',
    readTime: '3 min de lectura',
    subtitle: 'La alegoría de los dos toneles (Gorgias de Platón)',
    summary: 'Reflexión profunda sobre el diálogo platónico ante Calicles: el contraste entre la templanza y el deseo insaciable, y la tesis metaética antihedonista.',
    sourceUrl: 'https://www.filosofia.org/cla/pla/img/azf05115.pdf',
    sourceLabel: 'Gorgias, Platón (filosofia.org)',
    paragraphs: [
      'Les comparto una muy breve pero poderosa reflexión de Sócrates en el diálogo <em>Gorgias</em> de Platón ante Calicles.',
      'Calicles cree que la felicidad consiste en tener deseos grandes y poder satisfacerlos sin límite; la templanza es solo cobardía disfrazada de virtud por los débiles.',
      '<blockquote>Sócrates opone la alegoría de dos hombres con toneles (odres): uno con toneles sanos que llena una vez y no necesita más (vida moderada, autosuficiente); otro con toneles agujereados que debe llenar sin cesar día y noche (vida de deseo insaciable).</blockquote>',
      'Esto lleva a la pregunta clave: si el placer fuera idéntico al bien, entonces el hombre que se rasca constantemente por comezón, o el que satisface cualquier apetito por bajo que sea, viviría feliz — conclusión que Calicles mismo encuentra absurda y de la que intenta escapar, aunque sin lograr una salida consistente.',
      '<blockquote>Con esto Sócrates establece una tesis metaética antihedonista: placer y bien no son la misma cosa, porque hay placeres malos (los del cobarde, los del intemperante) y males que producen bien (el dolor del castigo curativo). El criterio del bien no puede ser, entonces, la mera intensidad o cantidad de placer, sino algo relacionado con el orden, la medida y la virtud del alma.</blockquote>',
    ],
  },
  laura: {
    title: 'Voz, Conciencia y Juventud: La Resistencia en Acción',
    category: 'Activismo & Comunicación Estratégica',
    date: '09 de septiembre de 2026',
    readTime: '3 min de lectura',
    subtitle: 'Estrategias para movilizar a una generación adormecida hacia causas trascendentales',
    summary: 'Cómo articular un mensaje valiente que conecte con la juventud sin transigir con las modas ideológicas del momento.',
    paragraphs: [
      'Las redes sociales no deben ser meros escaparates de vanidad. Son las nuevas plazas de debate donde se libra la batalla cultural por el corazón y la mente de nuestra generación.',
      '<blockquote>Inspirar a otros no requiere gritar más fuerte, sino sembrar con convicción y coherencia testimonios vivos de verdad.</blockquote>',
      'Cada joven que despierta y asume la defensa de la vida y la libertad es un eslabón que fortalece nuestra resistencia colectiva.',
    ],
  },
};

export function getPublicationBySlug(slug: string): MemberPublication | undefined {
  const normalized = slug.toLowerCase().trim();
  return MEMBER_PUBLICATIONS[normalized] ?? (normalized === 'ian' ? MEMBER_PUBLICATIONS.ilan : undefined);
}
