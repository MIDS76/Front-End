"use client";

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ChartOptions,
  TooltipItem,
  GridLineOptions
} from "chart.js";

import "@/app/globals.css";
import ProtectedRoute from "@/components/ProtectedRoute";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement
);

interface Alunos {
  nome: string,
  conselho: string, 
  chamado: boolean,
  visualizou: boolean
}

export default function DashboardPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState("");
  const [anoAtual, setAnoAtual] = useState(0);
  const [alunos, setAlunos] = useState<Alunos[]>([]);

  const gerarAlunos = (mes: number, ano: number) => {
    const seed = mes + ano;
    const status = ["Pré-conselho", "Conversa", "Concluído"];
    const nomesReais = [
      "Lucas Silva",
      "Ana Beatriz",
      "Carlos Eduardo",
      "Juliana Mendes",
      "Bruno Costa",
      "Larissa Rocha",
      "Felipe Martins",
      "Camila Oliveira",
      "Gustavo Pereira",
      "Isabela Souza",
      "Rafael Lima",
      "Mariana Gomes",
      "João Pedro",
      "Letícia Ribeiro",
      "Thiago Fernandes",
      "Amanda Duarte",
      "Pedro Henrique",
      "Renata Almeida",
      "Vinícius Barbosa",
      "Daniela Castro",
      "Matheus Rocha",
      "Tatiane Silva",
      "Leonardo Araújo",
      "Gabriela Monteiro",
      "André Nunes",
      "Fernanda Carvalho",
      "Diego Freitas",
      "Patrícia Ramos",
      "Rodrigo Teixeira",
      "Débora Lima",
    ];

    return Array.from({ length: 30 }, (_, i) => {
      const rand = (x: number) => Math.abs(Math.sin(seed + i * x)) % 1;

      return {
        nome: nomesReais[i % nomesReais.length],
        conselho: status[Math.floor(rand(5) * 3)],
        chamado: rand(7) > 0.4,
        visualizou: rand(11 + i) > 0.5, // <- Agora depende do aluno e da seed do mês/ano
      };
          
    });
  };

  useEffect(() => {
    const data = new Date();
    const mes = mesSelecionado === "" ? data.getMonth() : +mesSelecionado;
    const ano = anoSelecionado === "" ? data.getFullYear() : +anoSelecionado;

    if (ano >= 2025 && mes >= 4) {
      setAlunos([]);
      return;
    }

    // setDiasNoMes(diasMes);
    setAnoAtual(data.getFullYear());
    setAnoSelecionado(ano.toString());
    setMesSelecionado(mes.toString());

    const novosAlunos = gerarAlunos(mes, ano);
    setAlunos(novosAlunos);
  }, [mesSelecionado, anoSelecionado]);

  useEffect(() => {
    const checkDark = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkDark();
    const observer = new MutationObserver(() => checkDark());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const getColors = () => {
    return isDarkMode
      ? ["#285E6B", "#3C8C95", "#61D4DA"]
      : ["#19323C", "#2B5E64", "#49A5AB"];
  };

  
  const doughnutData = {
    labels: ["Pré-conselho", "Conversa", "Concluído"],
    datasets: [
      {
        data: [
          alunos.filter((a) => a.conselho === "Pré-conselho").length,
          alunos.filter((a) => a.conselho === "Conversa").length,
          alunos.filter((a) => a.conselho === "Concluído").length,
        ],
        backgroundColor: getColors(),
        borderWidth: 1,
      },
    ],
  };

  const total = doughnutData.datasets[0].data.reduce((a, b) => a + b, 0);
  const percent = doughnutData.datasets[0].data.map((v) =>
    Math.round((v / total) * 100)
  );

  const lineData = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    datasets: [
      {
        label: "Visualizaram",
        data: Array.from({ length: 6 }, (_, dia) =>
          alunos.filter(
            (a) => a.visualizou && Math.abs(Math.sin(dia + 1)) > 0.4
          ).length
        ),
        borderColor: getColors()[2],
        pointBackgroundColor: getColors()[2],
        pointBorderColor: "white",
        pointRadius: 4,
        pointHoverRadius: 5,
        tension: 0.3,
      },
      {
        label: "Não visualizaram",
        data: Array.from({ length: 6 }, (_, dia) =>
          alunos.filter(
            (a) => !a.visualizou && Math.abs(Math.cos(dia + 2)) > 0.4
          ).length
        ),
        borderColor: getColors()[0],
        pointBackgroundColor: getColors()[0],
        pointBorderColor: "white",
        pointRadius: 4,
        pointHoverRadius: 5,
        tension: 0.3,
      },
    ],
  };
  
  

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5, color: "#6B7280", font: { size: 12 } },
        grid: { color: "rgba(107,114,128,0.2)", borderDash: [4, 4] }  as Partial<GridLineOptions>,
      },
      x: {
        ticks: { display: false },   // 👈 oculta os labels dos dias
        grid: { display: false },    // 👈 oculta a grade vertical
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: "#FFFFFF",
        titleColor: "#000000",
        bodyColor: "#000000",
        borderColor: "#CCCCCC",
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: () => "", // 👈 isso remove o título (ex: "Seg", "Ter", etc.)
          label: function (context: TooltipItem<"line">) {
            const value = context.raw;
            return `${context.dataset.label}: ${value}`;
          },
        },
      },
      
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#6B7280",
          boxWidth: 10,
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
  };
  
  
  
  

  const barData = {
    labels: ["01", "02", "03", "04", "05", "06", "07"],
    datasets: [
      {
        label: "Alunos Chamados",
        data: Array.from(
          { length: 7 },
          () => alunos.filter(() => Math.random() > 0.5).length
        ),
        backgroundColor: getColors()[1],
        borderColor: getColors()[1],
        borderWidth: 1,
        barPercentage: 0.3,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 30,
        ticks: { stepSize: 10, color: "#6B7280", font: { size: 12 } },
        grid: { color: "rgba(107,114,128,0.2)", borderDash: [4, 4] },
      },
      x: {
        ticks: { color: "#6B7280", font: { size: 12 } },
        grid: { display: false },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: "#FFFFFF",
        titleColor: "#000000",
        bodyColor: "#000000",
        borderColor: "#CCCCCC",
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            const value = context.raw;
            return `Alunos Chamados: ${value}`;
          },
        },
      },
      legend: { display: false },
    },
  };

  const gerarRelatorioPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Relatório de Alunos - Visualização", 14, 20);

  doc.setFontSize(12);
  doc.text(
    `Mês: ${
      [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ][+mesSelecionado] || "-"
    } | Ano: ${anoSelecionado}`,
    14,
    28
  );

  const alunosOrdenados = [...alunos].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
  );

  const tableData = alunosOrdenados.map((aluno, index) => [
    index + 1,
    aluno.nome,
    aluno.visualizou ? "Sim" : "Não",
    aluno.conselho,
    aluno.chamado ? "Sim" : "Não",
  ]);

  autoTable(doc, {
    head: [["#", "Nome", "Visualizou", "Conselho", "Chamado"]],
    body: tableData,
    startY: 35,
    headStyles: {
      fillColor: [58, 109, 112], // <- #3a6d70
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      textColor: [50, 50, 50],
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  doc.save(`relatorio-alunos-visualizacao-${mesSelecionado}-${anoSelecionado}.pdf`);
};


  const gerarRelatorioFasesConselho = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Relatório - Fases dos Conselhos", 14, 20);

    const dados = ["Pré-conselho", "Conversa", "Concluído"].map((fase) => {
      const count = alunos.filter((a) => a.conselho === fase).length;
      const porcentagem = ((count / alunos.length) * 100).toFixed(1);
      return [fase, `${count} (${porcentagem}%)`];
    });

    autoTable(doc, {
      head: [["Fase", "Quantidade (%)"]],
      body: dados,
      startY: 30,
      headStyles: {
        fillColor: [58, 109, 112],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(
      `relatorio-fases-conselho-${mesSelecionado}-${anoSelecionado}.pdf`
    );
  };

  const gerarRelatorioVisualizacaoConselho = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text("Relatório - Visualização de Conselhos", 14, 20);
  
    const totalVisualizados = alunos.filter((a) => a.visualizou).length;
    const totalNaoVisualizados = alunos.length - totalVisualizados;
  
    doc.setFontSize(12);
    doc.text(
      `Visualizaram: ${totalVisualizados} alunos (${(
        (totalVisualizados / alunos.length) *
        100
      ).toFixed(1)}%)`,
      14,
      30
    );
    doc.text(
      `Não visualizaram: ${totalNaoVisualizados} alunos (${(
        (totalNaoVisualizados / alunos.length) *
        100
      ).toFixed(1)}%)`,
      14,
      38
    );
  
    const tableData = alunos
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" }))
      .map((aluno, i) => [
        i + 1,
        aluno.nome,
        aluno.visualizou ? "Sim" : "Não",
      ]);
  
    autoTable(doc, {
      head: [["#", "Nome", "Visualizou"]],
      body: tableData,
      startY: 45,
      headStyles: {
        fillColor: [58, 109, 112],
        textColor: 255,
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
  
    doc.save(
      `relatorio-visualizacao-conselho-${mesSelecionado}-${anoSelecionado}.pdf`
    );
  };
  

  const gerarRelatorioChamados = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Relatório - Alunos Chamados", 14, 20);

    const chamados = alunos
      .map((a) => (a.chamado ? 1 : 0))
      .reduce((a: number, b: number) => a + b, 0);
    const porcentagem = ((chamados / alunos.length) * 100).toFixed(1);

    doc.setFontSize(12);
    doc.text(`Total chamados: ${chamados} alunos (${porcentagem}%)`, 14, 30);

    const tableData = alunos
      .sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
      )
      .map((aluno, i) => [i + 1, aluno.nome, aluno.chamado ? "Sim" : "Não"]);

    autoTable(doc, {
      head: [["#", "Nome", "Chamado"]],
      body: tableData,
      startY: 40,
      headStyles: {
        fillColor: [58, 109, 112],
        textColor: 255,
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(`relatorio-chamados-${mesSelecionado}-${anoSelecionado}.pdf`);
  };

  const doughnutOptions = {
    cutout: "70%",
    tooltip: {
      callbacks: {
        label: (tooltipItem: TooltipItem<"doughnut">) => {
          const value = doughnutData.datasets[0].data[tooltipItem.dataIndex];
          return `${value} conselhos`;
        },
      },
      displayColors: false,
      backgroundColor: "#fff",
      titleColor: "#000",
      bodyColor: "#000",
      borderColor: "#ccc",
      borderWidth: 1,
      padding: 10,
      cornerRadius: 6,
      titleFont: { size: 14, weight: "bold" },
      bodyFont: { size: 12 },
      boxPadding: 8,
      caretPadding: 10,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <ProtectedRoute>
    <main className="h-[calc(100vh-5rem)] flex-col items-center justify-between pt-10 px-4">
      <h1 className="text-4xl font-bold font-title ml-8 self-start">
        Dashboard
      </h1>

      <div className="ml-8 flex gap-8 m-[2vh]">
        <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Meses</SelectLabel>
              {[
                "Janeiro",
                "Fevereiro",
                "Março",
                "Abril",
                "Maio",
                "Junho",
                "Julho",
                "Agosto",
                "Setembro",
                "Outubro",
                "Novembro",
                "Dezembro",
              ].map((mes, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {mes}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Anos</SelectLabel>
              {[0, 1, 2, 3, 4, 5].map((offset) => (
                <SelectItem key={offset} value={(anoAtual - offset).toString()}>
                  {anoAtual - offset}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-6 xl:justify-between w-full px-8">
        <Card className="lg:w-[calc((1/3*100%)-1rem)] w-full md:w-[calc(50%-0.75rem)]">
          <CardHeader className="flex flex-col gap-2 pb-2">
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-base font-medium">
                Fases dos Conselhos
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="bg-ring text-white hover:text-popover-foreground"
                onClick={gerarRelatorioFasesConselho}
              >
                Ver Relatório
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[220px] flex flex-col items-center mt-5">
            <div className="h-[150px] w-[150px]">
              <Doughnut options={doughnutOptions} data={doughnutData} />
            </div>
            <div className="flex justify-around w-full mt-4">
              {doughnutData.labels.map((label, index) => (
                <div key={label} className="text-xs flex items-start">
                  <div
                    className="w-2.5 h-2.5 rounded-full mt-1 mr-2"
                    style={{
                      backgroundColor:
                        doughnutData.datasets[0].backgroundColor[index],
                    }}
                  />
                  <div className="flex flex-col items-start">
                    <div className="font-semibold">{label}</div>
                    <div className="text-gray-500">{percent[index]}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:w-[calc((1/3*100%)-1rem)] w-full md:w-[calc(50%-0.75rem)]">
          <CardHeader className="flex flex-col gap-2 pb-2">
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-base font-medium"> 
                Visualização de Conselhos
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="bg-ring text-white hover:text-popover-foreground"
                onClick={gerarRelatorioVisualizacaoConselho}
              >
                Ver Relatório
              </Button>
            </div>
            <span className="text-2xl font-semibold">
              {alunos.length > 0
                ? `${(
                    (alunos.filter((a) => a.visualizou).length / alunos.length) *
                    100
                  ).toFixed(1)}%`
                : "--"}
            </span>
          </CardHeader>
          <CardContent className="h-48  flex justify-center items-center">
            <div className="h-[160px] w-full max-w-[500px]">
              <Line data={lineData} options={lineOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:w-[calc((1/3*100%)-1rem)] w-full md:w-full">
          <CardHeader className="flex flex-col gap-2 pb-2">
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-base font-medium">
                Quantidade de alunos chamados
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="bg-ring text-white hover:text-popover-foreground"
                onClick={gerarRelatorioChamados}
              >
                Ver Relatório
              </Button>
            </div>
          </CardHeader>

          <CardContent className="h-[220px] flex justify-center items-center mt-5">
            <div className="h-full w-full">
              <Bar data={barData} options={barOptions} />
            </div>
          </CardContent>
        </Card>
        <div className="flex my-8 lg:my-[4vh] w-full justify-end">
          <Button
            variant="outline"
            className="bg-ring text-white hover:text-popover-foreground"
            onClick={gerarRelatorioPDF}
          >
            Gerar Relatórios
          </Button>
        </div>
      </div>
    </main>
    </ProtectedRoute>
  );
}
