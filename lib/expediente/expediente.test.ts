import { describe, it, expect } from "vitest";
import { dentroDoExpediente, proximaAbertura, minutosUteisEntre } from "./expediente";

describe("dentroDoExpediente", () => {
  it("aceita quarta-feira às 10h", () => {
    expect(dentroDoExpediente(new Date(2026, 6, 29, 10, 0))).toBe(true);
  });

  it("recusa o intervalo de almoço às 13h", () => {
    expect(dentroDoExpediente(new Date(2026, 6, 29, 13, 0))).toBe(false);
  });

  it("aceita quarta-feira às 15h", () => {
    expect(dentroDoExpediente(new Date(2026, 6, 29, 15, 0))).toBe(true);
  });

  it("recusa depois das 18h", () => {
    expect(dentroDoExpediente(new Date(2026, 6, 29, 18, 1))).toBe(false);
  });

  it("aceita sábado de manhã", () => {
    expect(dentroDoExpediente(new Date(2026, 7, 1, 9, 0))).toBe(true);
  });

  it("recusa sábado à tarde", () => {
    expect(dentroDoExpediente(new Date(2026, 7, 1, 15, 0))).toBe(false);
  });

  it("recusa domingo o dia inteiro", () => {
    expect(dentroDoExpediente(new Date(2026, 7, 2, 10, 0))).toBe(false);
  });
});

describe("proximaAbertura", () => {
  it("no almoço aponta para as 14h do mesmo dia", () => {
    const r = proximaAbertura(new Date(2026, 6, 29, 13, 0));
    expect(r.getDate()).toBe(29);
    expect(r.getHours()).toBe(14);
  });

  it("na noite de sexta aponta para sábado às 8h", () => {
    const r = proximaAbertura(new Date(2026, 6, 31, 20, 0));
    expect(r.getDate()).toBe(1);
    expect(r.getHours()).toBe(8);
  });

  it("no domingo aponta para segunda às 8h", () => {
    const r = proximaAbertura(new Date(2026, 7, 2, 10, 0));
    expect(r.getDate()).toBe(3);
    expect(r.getHours()).toBe(8);
  });
});

describe("minutosUteisEntre", () => {
  it("conta minutos corridos dentro do mesmo turno", () => {
    const r = minutosUteisEntre(new Date(2026, 6, 29, 10, 0), new Date(2026, 6, 29, 10, 30));
    expect(r).toBe(30);
  });

  it("desconta o intervalo de almoço", () => {
    const r = minutosUteisEntre(new Date(2026, 6, 29, 11, 30), new Date(2026, 6, 29, 14, 30));
    expect(r).toBe(60);
  });

  it("ignora o período fechado da noite", () => {
    const r = minutosUteisEntre(new Date(2026, 6, 29, 17, 30), new Date(2026, 6, 30, 8, 30));
    expect(r).toBe(60);
  });
});
