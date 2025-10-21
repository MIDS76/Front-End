import React from "react";
interface TimelineStep {
  id: number;
  label: string;
}

interface TimelineProps {
  etapa: number;
}

export default function Timeline({ etapa }: TimelineProps) {
  const steps: TimelineStep[] = [
    { id: 1, label: "Pré-Conselho" },
    { id: 2, label: "Reunião" },
    { id: 3, label: "Conversas Particulares" },
    { id: 4, label: "Resultados" },
  ];

  // const [currentStep, setCurrentStep] = useState(step);

  // const handleNext = () => {
  //   if (currentStep < steps.length) {
  //     setCurrentStep(currentStep + 1);
  //   }
  // };

  // const handlePrevious = () => {
  //   if (currentStep > 1) {
  //     setCurrentStep(currentStep - 1);
  //   }
  // };

  return (
    <div className="w-full flex flex-col-reverse gap-y-2">
      <div
        className={`absolute flex flex-col items-center w-fit gap-y-4 self-end mr-8 ${
          etapa >= steps.length && "pb-9"
        }`}
      >
        {/* <ButtonTT
          tooltip="none"
          mode="text-icon"
          variant="default"
          size="sm"
          icon="ChevronRight"
          onClick={handleNext}
          disabled={currentStep === steps.length}
          className="disabled:hidden"
        >
          {currentStep >= steps.length - 1 ? "Finalizar" : "Próximo"}
        </ButtonTT> */}
        {/* <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button> */}
      </div>

      <div className="relative">
        <div className="absolute top-1/3 left-0 w-full h-1 -translate-y-1/2 bg-muted">
          <div
            className="h-full bg-primary brightness-150 saturate-150 transition-all duration-300"
            style={
              etapa === 1
                ? {
                    width: "13%",
                  }
                : etapa === 2
                ? { width: "37%" }
                : etapa === 3
                ? { width: "62%" }
                : etapa === 4
                ? { width: "100%" }
                : {}
              // {
              //   width: `${
              //     ((currentStep * 2 - 1) / (steps.length * 2)) * 100
              //   }%`,
              // }
            }
          ></div>
        </div>

        <div className="relative top-3 flex justify-around pointer-events-none">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 z-10 mb-2 ${
                  step.id <= etapa
                    ? "bg-white border-primary brightness-150 saturate-150"
                    : "bg-white border-muted"
                }`}
              ></div>
              <span
                className={`text-sm font-medium text-center max-w-[120px] ${
                  step.id <= etapa ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
