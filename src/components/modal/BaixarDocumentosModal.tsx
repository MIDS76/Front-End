"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "@/utils/axios";

interface BaixarDocumentosModalProps {
  open: boolean;
  onClose: () => void;
  conselho: any | null;
  role: string | undefined;
}

export default function BaixarDocumentosModal({
  open,
  onClose,
  conselho,
  role
}: BaixarDocumentosModalProps) {
  if (!conselho) return null;

  const STATUS_PRE = ["NAO_INICIADO", "PRE_CONSELHO", "CONSELHO", "AGUARDANDO_RESULTADO", "RESULTADO"];
  const STATUS_CONSELHO = ["CONSELHO", "AGUARDANDO_RESULTADO", "RESULTADO"];

  const statusConselhoUpper = conselho.etapas ? conselho.etapas.toUpperCase() : "";

  const podePre = STATUS_PRE.includes(statusConselhoUpper);
  const podeConselho = STATUS_CONSELHO.includes(statusConselhoUpper);

  // ------------------------------------------------------------
  // FUNÇÃO PARA BUSCAR TURMA (CORRETO!)
  // ------------------------------------------------------------
  async function fetchTurmaInfo(idTurma: number) {
    try {
      const resp = await api.get(`/turmas/buscar/${idTurma}`);

      if (!resp.data) return null;

      return resp.data;
    } catch (e) {
      console.error("Erro ao buscar turma:", e);
      return null;
    }
  }

  function addHeader(pdf: jsPDF, titulo: string, sub: string[]) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(titulo, pdf.internal.pageSize.getWidth() / 2, 18, { align: "center" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    let y = 30;
    for (const line of sub) {
      pdf.text(line, 15, y);
      y += 7;
    }

    pdf.setDrawColor(0);
    pdf.line(15, y + 2, pdf.internal.pageSize.getWidth() - 15, y + 2);

    return y + 10;
  }

  function ensureSpace(pdf: jsPDF, y: number, threshold = 260) {
    if (y > threshold) {
      pdf.addPage();
      return 20;
    }
    return y;
  }

  // -----------------------------------------------------------
  // PDF DO PRÉ-CONSELHO
  // -----------------------------------------------------------
  const gerarPDFPreConselho = async () => {
    try {
      const dadosResp = await api.get(`/preConselho/buscar/${conselho.id}/feedbacks`);
      const dados = dadosResp.data;
      if (!dados) throw new Error("Resposta vazia do servidor");

      const turmaInfo = await fetchTurmaInfo(conselho.idTurma);

      const nomeTurma =
        turmaInfo?.nome ||
        `Turma-${conselho.idTurma}`;

      const nomeCurso =
        turmaInfo?.curso ||
        "Curso não informado";

      const respAlunos = await api.get(`/aluno-turma/listarAlunosPorTurma/${conselho.idTurma}`);
      const alunosDaTurma = Array.isArray(respAlunos.data) && respAlunos.data.length > 0
        ? respAlunos.data[0].alunos || []
        : [];

      const pdf = new jsPDF();
      let y = addHeader(pdf, "Relatório do Pré-Conselho", [
        `Gerado em: ${new Date().toLocaleString()}`,
        `Turma: ${nomeTurma}`,
        `Curso: ${nomeCurso}`,
      ]);

      if (dados.preConselhoPedagogicos?.length) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("Pedagógico", 15, y);
        y += 5;

        autoTable(pdf, {
          startY: y + 5,
          head: [["Pontos Positivos", "Pontos de Melhoria", "Sugestões"]],
          body: dados.preConselhoPedagogicos.map((p: any) => [
            p.pontosPositivos || "-",
            p.pontosMelhoria || "-",
            p.sugestoes || "-"
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [52, 152, 219], textColor: 255, halign: "center" },
          theme: "striped"
        });

        y = (pdf as any).lastAutoTable.finalY + 12;
      }

      if (dados.preConselhoProfessores?.length) {
        y = ensureSpace(pdf, y);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("Professores", 15, y);
        y += 5;

        autoTable(pdf, {
          startY: y + 5,
          head: [["Professor", "Unidade Curricular", "Pontos Positivos", "Pontos de Melhoria", "Sugestões"]],
          body: dados.preConselhoProfessores.map((prof: any) => [
            prof.nomeProfessor || "-",
            prof.nomeUc || "-",
            prof.pontosPositivos || "-",
            prof.pontoMelhoria || "-",
            prof.sugestoes || "-"
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
          theme: "striped"
        });

        y = (pdf as any).lastAutoTable.finalY + 12;
      }

      if (dados.preConselhoAmbienteEnsino?.length) {
        y = ensureSpace(pdf, y);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("Ambiente de Ensino", 15, y);
        y += 5;

        autoTable(pdf, {
          startY: y + 5,
          head: [["Pontos Positivos", "Pontos de Melhoria", "Sugestões"]],
          body: dados.preConselhoAmbienteEnsino.map((a: any) => [
            a.pontosPositivos || "-",
            a.pontosMelhoria || "-",
            a.sugestoes || "-"
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [230, 126, 34], textColor: 255, halign: "center" },
          theme: "striped"
        });

        y = (pdf as any).lastAutoTable.finalY + 12;
      }

      if (dados.preConselhoSupervisores?.length) {
        y = ensureSpace(pdf, y);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("Supervisores", 15, y);
        y += 5;

        autoTable(pdf, {
          startY: y + 5,
          head: [["Pontos Positivos", "Pontos de Melhoria", "Sugestões"]],
          body: dados.preConselhoSupervisores.map((s: any) => [
            s.pontosPostivos || "-",
            s.pontosMelhoria || "-",
            s.sugestoes || "-"
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [39, 174, 96], textColor: 255, halign: "center" },
          theme: "striped"
        });

        y = (pdf as any).lastAutoTable.finalY + 12;
      }

      if (alunosDaTurma.length) {
        y = ensureSpace(pdf, y);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("Lista de Assinatura - Alunos", 15, y);
        y += 5;

        autoTable(pdf, {
          startY: y + 5,
          head: [["Aluno", "Assinatura"]],
          body: alunosDaTurma.map((a: any) => [
            a.nome || "-",
            ""
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [149, 165, 166], textColor: 255, halign: "center" },
          theme: "grid"
        });
      }

      pdf.save(`pre-conselho-${nomeTurma}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF do Pré-Conselho:", err);
      alert("Não foi possível gerar o PDF do Pré-Conselho.");
    }
  };

  // -----------------------------------------------------------
  // PDF DO CONSELHO
  // -----------------------------------------------------------
  const gerarPDFConselho = async () => {
    try {
      const resp = await api.get(`/conselhos/listar/${conselho.id}/alunosFeedbacks`);
      const dados = resp.data;
      if (!dados) throw new Error("Resposta vazia do servidor");

      const turmaInfo = await fetchTurmaInfo(conselho.idTurma);

      const nomeTurma =
        turmaInfo?.nome ||
        `Turma-${conselho.idTurma}`;

      const nomeCurso =
        turmaInfo?.curso ||
        "Curso não informado";

      const respProfs = await api.get(`/ucprofessor/listar`, { params: { idConselho: conselho.id } });
      const professoresDoConselho = Array.isArray(respProfs.data) ? respProfs.data : [];

      const pdf = new jsPDF();
      let y = addHeader(pdf, "Relatório do Conselho", [
        `Gerado em: ${new Date().toLocaleString()}`,
        `Turma: ${nomeTurma}`,
        `Curso: ${nomeCurso}`,
      ]);

      if (dados.turmaFeedbackResponseDTO) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("Feedback da Turma", 15, y);
        y += 5;

        autoTable(pdf, {
          startY: y + 5,
          head: [["Pedagógico", "Pontos Positivos", "Pontos de Melhoria", "Sugestão"]],
          body: [[
            dados.turmaFeedbackResponseDTO.nomePedagogico || "-",
            dados.turmaFeedbackResponseDTO.pontosPositivos || "-",
            dados.turmaFeedbackResponseDTO.pontosMelhoria || "-",
            dados.turmaFeedbackResponseDTO.sugestao || "-"
          ]],
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [52, 152, 219], textColor: 255, halign: "center" },
          theme: "striped"
        });

        y = (pdf as any).lastAutoTable.finalY + 12;
      }

      if (dados.alunoFeedbackResponseDTO?.length) {
        y = ensureSpace(pdf, y);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("Feedback dos Alunos", 15, y);
        y += 5;

        autoTable(pdf, {
          startY: y + 5,
          head: [["Aluno", "Pedagógico", "Pontos Positivos", "Pontos de Melhoria", "Sugestão"]],
          body: dados.alunoFeedbackResponseDTO.map((a: any) => [
            a.nomeAluno || "-",
            a.nomePedagogico || "-",
            a.pontosPositivos || "-",
            a.pontosMelhoria || "-",
            a.sugestao || "-"
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
          theme: "striped"
        });

        y = (pdf as any).lastAutoTable.finalY + 12;
      }

      y = ensureSpace(pdf, y);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Lista de Assinatura - Professores", 15, y);
      y += 5;

      if (professoresDoConselho.length > 0) {
        autoTable(pdf, {
          startY: y + 5,
          head: [["Professor", "Assinatura"]],
          body: professoresDoConselho.map((p: any) => [
            p.nomeProfessor || "-",
            ""
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [127, 140, 141], textColor: 255, halign: "center" },
          theme: "grid"
        });
      } else {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.text("Nenhum professor vinculado ao conselho.", 15, y + 5);
      }

      pdf.save(`conselho-${nomeTurma}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF do Conselho:", err);
      alert("Não foi possível gerar o PDF do Conselho.");
    }
  };

  // -----------------------------------------------------------
  // RENDERIZAÇÃO
  // -----------------------------------------------------------
  return (
    <Dialog open={open} onOpenChange={(state) => { if (!state) onClose(); }}>
      <DialogContent className="max-w-[560px] rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Baixar documentos do Conselho
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 mt-4">
          {podePre && (
            <div className="border rounded-xl p-4 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="text-black" size={26} />
                <div>
                  <div className="font-medium">Pré-Conselho</div>
                  <div className="text-xs text-muted-foreground">
                    Feedback consolidado + lista de assinatura dos alunos
                  </div>
                </div>
              </div>

              <button
                onClick={gerarPDFPreConselho}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground"
              >
                <FileSpreadsheet size={18} />
                Baixar PDF
              </button>
            </div>
          )}

          {podeConselho && (
            <div className="border rounded-xl p-4 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="text-black" size={26} />
                <div>
                  <div className="font-medium">Conselho</div>
                  <div className="text-xs text-muted-foreground">
                    Feedback da turma e alunos + lista de assinatura dos professores
                  </div>
                </div>
              </div>

              <button
                onClick={gerarPDFConselho}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground"
              >
                <FileSpreadsheet size={18} />
                Baixar PDF
              </button>
            </div>
          )}

          {!podePre && !podeConselho && (
            <p className="text-center text-muted-foreground text-sm">
              Nenhum documento disponível para este status.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
