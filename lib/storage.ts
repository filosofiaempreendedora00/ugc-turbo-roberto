import { Cliente, Produto, Roteiro, GuiaMarca, GuiaProduto, AvatarICP } from "@/types";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `Erro ${res.status}`);
  }
  return res.json();
}

// ─── CLIENTES ────────────────────────────────────────────────────────────────

export async function getClientes(): Promise<Cliente[]> {
  return req<Cliente[]>("/api/clientes");
}

export async function getClienteById(id: string): Promise<Cliente | undefined> {
  try {
    return await req<Cliente>(`/api/clientes/${id}`);
  } catch {
    return undefined;
  }
}

export async function createCliente(nome: string): Promise<Cliente> {
  return req<Cliente>("/api/clientes", {
    method: "POST",
    body: JSON.stringify({ nome }),
  });
}

export async function updateCliente(
  id: string,
  dados: Partial<Omit<Cliente, "id" | "criadoEm">>
): Promise<Cliente> {
  return req<Cliente>(`/api/clientes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dados),
  });
}

export async function updateGuiaMarca(clienteId: string, guia: GuiaMarca): Promise<Cliente> {
  return updateCliente(clienteId, { guiaMarca: guia });
}

export async function deleteCliente(id: string): Promise<void> {
  await req(`/api/clientes/${id}`, { method: "DELETE" });
}

// ─── AVATARES ICP ─────────────────────────────────────────────────────────────

export async function getAvataresByCliente(clienteId: string): Promise<AvatarICP[]> {
  const cliente = await getClienteById(clienteId);
  return cliente?.avatares ?? [];
}

export async function addAvatar(clienteId: string, dados: Omit<AvatarICP, "id">): Promise<Cliente> {
  const cliente = await getClienteById(clienteId);
  if (!cliente) throw new Error("Cliente não encontrado");
  const avatar: AvatarICP = { id: generateId(), ...dados };
  return updateCliente(clienteId, { avatares: [...(cliente.avatares ?? []), avatar] });
}

export async function updateAvatar(
  clienteId: string,
  avatarId: string,
  dados: Partial<Omit<AvatarICP, "id">>
): Promise<Cliente> {
  const cliente = await getClienteById(clienteId);
  if (!cliente) throw new Error("Cliente não encontrado");
  const avatares = (cliente.avatares ?? []).map((a) =>
    a.id === avatarId ? { ...a, ...dados } : a
  );
  return updateCliente(clienteId, { avatares });
}

export async function deleteAvatar(clienteId: string, avatarId: string): Promise<Cliente> {
  const cliente = await getClienteById(clienteId);
  if (!cliente) throw new Error("Cliente não encontrado");
  const avatares = (cliente.avatares ?? []).filter((a) => a.id !== avatarId);
  return updateCliente(clienteId, { avatares });
}

// ─── PRODUTOS ────────────────────────────────────────────────────────────────

export async function getProdutos(): Promise<Produto[]> {
  return req<Produto[]>("/api/produtos");
}

export async function getProdutosByCliente(clienteId: string): Promise<Produto[]> {
  return req<Produto[]>(`/api/produtos?clienteId=${encodeURIComponent(clienteId)}`);
}

export async function getProdutoById(id: string): Promise<Produto | undefined> {
  try {
    return await req<Produto>(`/api/produtos/${id}`);
  } catch {
    return undefined;
  }
}

export async function createProduto(clienteId: string, nome: string): Promise<Produto> {
  return req<Produto>("/api/produtos", {
    method: "POST",
    body: JSON.stringify({ clienteId, nome }),
  });
}

export async function updateProduto(
  id: string,
  dados: Partial<Omit<Produto, "id" | "clienteId" | "criadoEm">>
): Promise<Produto> {
  return req<Produto>(`/api/produtos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dados),
  });
}

export async function updateGuiaProduto(produtoId: string, guia: GuiaProduto): Promise<Produto> {
  return updateProduto(produtoId, { guia });
}

export async function deleteProduto(id: string): Promise<void> {
  await req(`/api/produtos/${id}`, { method: "DELETE" });
}

// ─── ROTEIROS ────────────────────────────────────────────────────────────────

export async function getRoteiros(): Promise<Roteiro[]> {
  return req<Roteiro[]>("/api/roteiros");
}

export async function getRoteirosByCliente(clienteId: string): Promise<Roteiro[]> {
  return req<Roteiro[]>(`/api/roteiros?clienteId=${encodeURIComponent(clienteId)}`);
}

export async function saveRoteiro(roteiro: Omit<Roteiro, "id" | "geradoEm">): Promise<Roteiro> {
  return req<Roteiro>("/api/roteiros", {
    method: "POST",
    body: JSON.stringify(roteiro),
  });
}

export async function deleteRoteiro(id: string): Promise<void> {
  await req(`/api/roteiros/${id}`, { method: "DELETE" });
}
