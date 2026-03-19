export type TomDeVoz =
  | "divertido"
  | "sério"
  | "inspirador"
  | "educativo"
  | "provocativo"
  | "emocional"
  | "direto"
  | "conversacional";

export type FocoRoteiro =
  | "dor"
  | "benefício"
  | "transformação"
  | "prova"
  | "oferta"
  | "objeção";

export type FormatoRoteiro =
  | "face_to_camera"
  | "tiktok_style"
  | "lifestyle"
  | "demo"
  | "unboxing"
  | "looks";

export interface AvatarICP {
  id: string;
  nome: string;
  descricao: string;
}

export interface GuiaMarca {
  nome: string;
  tomDeVoz: string;
  publicoAlvo: string;
  diferenciais: string;
  posicionamento: string;
  observacoes: string;
}

export interface GuiaProduto {
  descricao: string;
  beneficios: string;
  doresQueResolve: string;
  diferenciais: string;
  oferta: string;
  observacoes: string;
}

export interface Produto {
  id: string;
  clienteId: string;
  nome: string;
  guia: GuiaProduto;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Cliente {
  id: string;
  nome: string;
  guiaMarca: GuiaMarca;
  avatares: AvatarICP[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface CenaRoteiro {
  cena: number;
  fala: string;
  briefingFilmagem: string;
}

export interface Roteiro {
  id: string;
  titulo: string;
  clienteId: string;
  produtoId: string;
  icp: string;
  foco: FocoRoteiro;
  formato: FormatoRoteiro;
  mensagemObrigatoria: string;
  cenas: CenaRoteiro[];
  geradoEm: string;
}

export interface ConfiguracaoGeracao {
  clienteId: string;
  produtoId: string;
  icp: string;
  foco: FocoRoteiro;
  formato: FormatoRoteiro;
  oferta: string;
  mensagemObrigatoria: string;
  quantidade: number;
}

export const FORMATO_LABELS: Record<FormatoRoteiro, string> = {
  face_to_camera: "Face to Camera",
  tiktok_style: "TikTok Style",
  lifestyle: "Lifestyle",
  demo: "Demo",
  unboxing: "Unboxing",
  looks: "Looks",
};

export const FOCO_LABELS: Record<FocoRoteiro, string> = {
  dor: "Dor",
  "benefício": "Benefício",
  "transformação": "Transformação",
  prova: "Prova Social",
  oferta: "Oferta",
  "objeção": "Objeção",
};

export const FORMATO_ICONS: Record<FormatoRoteiro, string> = {
  face_to_camera: "🎥",
  tiktok_style: "📱",
  lifestyle: "🌿",
  demo: "🔧",
  unboxing: "📦",
  looks: "✨",
};
