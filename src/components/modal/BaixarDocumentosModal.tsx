"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "@/utils/axios";

interface BaixarDocumentosModalProps {
  open: boolean;
  onClose: () => void;
  conselho: { id: number; status: string } | null;
}

export default function BaixarDocumentosModal({
  open,
  onClose,
  conselho
}: BaixarDocumentosModalProps) {
  if (!conselho) return null;

  const podePre = ["Pré-conselho", "Conselho", "Aguardando resultado", "Resultado"].includes(conselho.status);
  const podeConselho = ["Conselho", "Aguardando resultado", "Resultado"].includes(conselho.status);

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


  const gerarPDFPreConselho = async () => {
    try {
      const { id } = conselho;
      const resp = await api.get(`/preConselho/buscar/1/feedbacks`);
      const dados = resp.data;
      if (!dados) throw new Error("Resposta vazia do servidor");

      const pdf = new jsPDF();
      let y = addHeader(pdf, "Relatório do Pré-Conselho", [
        `ID Pré-Conselho: ${dados.id ?? "-"}`,
        `ID Conselho: ${dados.idConselho ?? "-"}`,
        `Gerado em: ${new Date().toLocaleString()}`
      ]);

      // Pedagógico
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
            p.sugestoes || "-",
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [52, 152, 219], textColor: 255, halign: "center" },
          theme: "striped",
        });
        y = (pdf as any).lastAutoTable.finalY + 12;
      }

      // Professores
      if (dados.preConselhoProfessores?.length) {
        if (y > 260) { pdf.addPage(); y = 20; }
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
            prof.sugestoes || "-",
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
          theme: "striped",
        });
        y = (pdf as any).lastAutoTable.finalY + 12;
      }

      // Ambiente de Ensino
      if (dados.preConselhoAmbienteEnsino?.length) {
        if (y > 260) { pdf.addPage(); y = 20; }
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
            a.sugestoes || "-",
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [230, 126, 34], textColor: 255, halign: "center" },
          theme: "striped",
        });
        y = (pdf as any).lastAutoTable.finalY + 12;
      }

      // Supervisores
      if (dados.preConselhoSupervisores?.length) {
        if (y > 260) { pdf.addPage(); y = 20; }
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
            s.sugestoes || "-",
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [39, 174, 96], textColor: 255, halign: "center" },
          theme: "striped",
        });
      }

      pdf.save(`pre-conselho-${id}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF do Pré-Conselho:", err);
      alert("Não foi possível gerar o PDF do Pré-Conselho.");
    }
  };

  const gerarPDFConselho = async () => {
    try {
      const { id } = conselho;
      const resp = await api.get(`/conselhos/listar/1/alunosFeedbacks`);
      const dados = resp.data;
      if (!dados) throw new Error("Resposta vazia do servidor");

      const pdf = new jsPDF();
      let y = addHeader(pdf, "Relatório do Conselho", [
        `ID Conselho: ${dados.turmaFeedbackResponseDTO?.idCOnselho ?? "-"}`,
        `Gerado em: ${new Date().toLocaleString()}`
      ]);

      // Turma
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
          theme: "striped",
        });
        y = (pdf as any).lastAutoTable.finalY + 12;
      }

      // Alunos
      if (dados.alunoFeedbackResponseDTO?.length) {
        if (y > 260) { pdf.addPage(); y = 20; }
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
          theme: "striped",
        });
      }

      pdf.save(`conselho-${id}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF do Conselho:", err);
      alert("Não foi possível gerar o PDF do Conselho.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => { if (!state) onClose(); }}
    >
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
                  <div className="text-xs text-muted-foreground">Feedback consolidado</div>
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
                  <div className="text-xs text-muted-foreground">Feedback da turma e alunos</div>
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
