import { Cliente, Produto, Roteiro, GuiaMarca, GuiaProduto } from "@/types";

const KEYS = {
  CLIENTES: "ugc:clientes",
  PRODUTOS: "ugc:produtos",
  ROTEIROS: "ugc:roteiros",
} as const;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

function safeGet<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function safeSet<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Erro ao salvar no localStorage:", e);
  }
}

// ─── CLIENTES ────────────────────────────────────────────────────────────────

export function getClientes(): Cliente[] {
  return safeGet<Cliente>(KEYS.CLIENTES);
}

export function getClienteById(id: string): Cliente | undefined {
  return getClientes().find((c) => c.id === id);
}

export function createCliente(nome: string): Cliente {
  const cliente: Cliente = {
    id: generateId(),
    nome,
    guiaMarca: {
      nome,
      tomDeVoz: "",
      publicoAlvo: "",
      diferenciais: "",
      posicionamento: "",
      observacoes: "",
    },
    criadoEm: now(),
    atualizadoEm: now(),
  };
  const lista = getClientes();
  lista.push(cliente);
  safeSet(KEYS.CLIENTES, lista);
  return cliente;
}

export function updateCliente(id: string, dados: Partial<Omit<Cliente, "id" | "criadoEm">>): Cliente {
  const lista = getClientes();
  const idx = lista.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Cliente não encontrado");
  lista[idx] = { ...lista[idx], ...dados, atualizadoEm: now() };
  safeSet(KEYS.CLIENTES, lista);
  return lista[idx];
}

export function updateGuiaMarca(clienteId: string, guia: GuiaMarca): Cliente {
  return updateCliente(clienteId, { guiaMarca: guia });
}

export function deleteCliente(id: string): void {
  const clientes = getClientes().filter((c) => c.id !== id);
  safeSet(KEYS.CLIENTES, clientes);
  const produtos = getProdutos().filter((p) => p.clienteId !== id);
  safeSet(KEYS.PRODUTOS, produtos);
}

// ─── PRODUTOS ────────────────────────────────────────────────────────────────

export function getProdutos(): Produto[] {
  return safeGet<Produto>(KEYS.PRODUTOS);
}

export function getProdutosByCliente(clienteId: string): Produto[] {
  return getProdutos().filter((p) => p.clienteId === clienteId);
}

export function getProdutoById(id: string): Produto | undefined {
  return getProdutos().find((p) => p.id === id);
}

export function createProduto(clienteId: string, nome: string): Produto {
  const produto: Produto = {
    id: generateId(),
    clienteId,
    nome,
    guia: {
      descricao: "",
      beneficios: "",
      doresQueResolve: "",
      diferenciais: "",
      oferta: "",
      observacoes: "",
    },
    criadoEm: now(),
    atualizadoEm: now(),
  };
  const lista = getProdutos();
  lista.push(produto);
  safeSet(KEYS.PRODUTOS, lista);
  return produto;
}

export function updateProduto(id: string, dados: Partial<Omit<Produto, "id" | "clienteId" | "criadoEm">>): Produto {
  const lista = getProdutos();
  const idx = lista.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Produto não encontrado");
  lista[idx] = { ...lista[idx], ...dados, atualizadoEm: now() };
  safeSet(KEYS.PRODUTOS, lista);
  return lista[idx];
}

export function updateGuiaProduto(produtoId: string, guia: GuiaProduto): Produto {
  return updateProduto(produtoId, { guia });
}

export function deleteProduto(id: string): void {
  const lista = getProdutos().filter((p) => p.id !== id);
  safeSet(KEYS.PRODUTOS, lista);
}

// ─── ROTEIROS ────────────────────────────────────────────────────────────────

export function getRoteiros(): Roteiro[] {
  return safeGet<Roteiro>(KEYS.ROTEIROS);
}

export function getRoteirosByCliente(clienteId: string): Roteiro[] {
  return getRoteiros().filter((r) => r.clienteId === clienteId);
}

export function saveRoteiro(roteiro: Omit<Roteiro, "id" | "geradoEm">): Roteiro {
  const novo: Roteiro = {
    ...roteiro,
    id: generateId(),
    geradoEm: now(),
  };
  const lista = getRoteiros();
  lista.push(novo);
  safeSet(KEYS.ROTEIROS, lista);
  return novo;
}

export function deleteRoteiro(id: string): void {
  const lista = getRoteiros().filter((r) => r.id !== id);
  safeSet(KEYS.ROTEIROS, lista);
}

export function clearAllData(): void {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
