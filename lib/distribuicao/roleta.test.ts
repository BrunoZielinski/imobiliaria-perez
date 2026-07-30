import { describe, it, expect } from "vitest";
import { proximoAtendente } from "./roleta";
import type { Atendente } from "@/lib/tipos";

const criar = (id: string, ordem: number, extras: Partial<Atendente> = {}): Atendente => ({
  id,
  nome: id,
  departamentos: ["comercial"],
  papel: "atendente",
  disponivel: true,
  ordem,
  ...extras,
});

const EXPEDIENTE = new Date(2026, 6, 29, 10, 0);
const FECHADO = new Date(2026, 7, 2, 10, 0);

describe("proximoAtendente", () => {
  it("escolhe o primeiro da fila quando o ponteiro está em zero", () => {
    const r = proximoAtendente({
      departamento: "comercial",
      atendentes: [criar("a", 0), criar("b", 1), criar("c", 2)],
      carga: {},
      ponteiro: 0,
      agora: EXPEDIENTE,
    });
    expect(r.atendente?.id).toBe("a");
    expect(r.proximoPonteiro).toBe(1);
  });

  it("avança circularmente e volta ao início", () => {
    const r = proximoAtendente({
      departamento: "comercial",
      atendentes: [criar("a", 0), criar("b", 1), criar("c", 2)],
      carga: {},
      ponteiro: 2,
      agora: EXPEDIENTE,
    });
    expect(r.atendente?.id).toBe("c");
    expect(r.proximoPonteiro).toBe(0);
  });

  it("pula quem está indisponível sem perder a vez do seguinte", () => {
    const r = proximoAtendente({
      departamento: "comercial",
      atendentes: [criar("a", 0, { disponivel: false }), criar("b", 1), criar("c", 2)],
      carga: {},
      ponteiro: 0,
      agora: EXPEDIENTE,
    });
    expect(r.atendente?.id).toBe("b");
    expect(r.proximoPonteiro).toBe(2);
  });

  it("pula quem já atingiu o teto de atendimentos", () => {
    const r = proximoAtendente({
      departamento: "comercial",
      atendentes: [criar("a", 0), criar("b", 1)],
      carga: { a: 5 },
      ponteiro: 0,
      agora: EXPEDIENTE,
    });
    expect(r.atendente?.id).toBe("b");
  });

  it("ignora atendente de outro departamento", () => {
    const r = proximoAtendente({
      departamento: "administrativo",
      atendentes: [criar("a", 0), criar("b", 1, { departamentos: ["administrativo"] })],
      carga: {},
      ponteiro: 0,
      agora: EXPEDIENTE,
    });
    expect(r.atendente?.id).toBe("b");
  });

  it("não atribui fora do expediente", () => {
    const r = proximoAtendente({
      departamento: "comercial",
      atendentes: [criar("a", 0)],
      carga: {},
      ponteiro: 0,
      agora: FECHADO,
    });
    expect(r.atendente).toBe(null);
    expect(r.proximoPonteiro).toBe(0);
  });

  it("não atribui quando todos estão no teto", () => {
    const r = proximoAtendente({
      departamento: "comercial",
      atendentes: [criar("a", 0), criar("b", 1)],
      carga: { a: 5, b: 5 },
      ponteiro: 0,
      agora: EXPEDIENTE,
    });
    expect(r.atendente).toBe(null);
  });

  it("não atribui quando o departamento não tem atendente", () => {
    const r = proximoAtendente({
      departamento: "recepcao",
      atendentes: [criar("a", 0)],
      carga: {},
      ponteiro: 0,
      agora: EXPEDIENTE,
    });
    expect(r.atendente).toBe(null);
  });
});
