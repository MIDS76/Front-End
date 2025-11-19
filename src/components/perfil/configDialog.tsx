"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ButtonTT from "../button/ButtonTT";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { Usuario } from "@/utils/types";
import { toast } from "sonner";
import TextField from "../input/textField";
import { showError, validatePassword, validatePasswordMatch, validateRequired } from "@/utils/formValidation";

export function ConfigDialog() {
  const [isOpen, setOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [oldPassword, setOldPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [primaryColor, setPrimaryColor] = React.useState<string>();
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const [typography, setTypography] = React.useState<"default" | "alternative">(
    "default"
  );
  const [fontSize, setFontSize] = React.useState<
    "small" | "medium" | "large" | string
  >("medium");

  const fontSizeOptions = [
    { name: "P", value: "small" },
    { name: "M", value: "medium" },
    { name: "G", value: "large" },
  ];

  const colorOptions = [
    { name: "green", value: "bg-[#2B5E64] hover:bg-[#2B5E64]/90" },
    { name: "blue", value: "bg-[#2B3347] hover:bg-[#2B3347]/90" },
    { name: "purple", value: "bg-[#462772] hover:bg-[#462772]/90" },
    { name: "pink", value: "bg-[#8D2065] hover:bg-[#8D2065]/90" },
    { name: "orange", value: "bg-[#825A2C] hover:bg-[#825A2C]/90" },
  ];

  interface ColorButtonProps {
    color: string;
    className: string;
  }

  const { setTheme } = useTheme();

  const auth = useAuth();

  const handleLogout = () => {
    // api.post("http://localhost:8099/auth/logout");
    auth.logout();
    open("/login", "_self");
  };

  function ColorButton({ color, className }: ColorButtonProps) {
    const isSelected = primaryColor === color;

    return (
      <ButtonTT
        tooltip="none"
        mode="small"
        variant="default"
        icon={isSelected ? "FaCheck" : undefined}
        onClick={() => {
          document.documentElement.classList.remove(
            "green",
            "blue",
            "purple",
            "pink",
            "orange"
          );
          document.documentElement.classList.add(color);
          setPrimaryColor(color);
          localStorage.setItem("primaryColor", color);
        }}
        className={className}
      />
    );
  }

  React.useEffect(() => {
    //
    const savedTypography = localStorage.getItem("typography") as
      | "default"
      | "alternative"
      | null;
    if (savedTypography) {
      setTypography(savedTypography);
      document.documentElement.classList.remove(
        "typography-default",
        "typography-alternative"
      );
      document.documentElement.classList.add(
        savedTypography === "default"
          ? "typography-default"
          : "typography-alternative"
      );
    }

    const savedColor = localStorage.getItem("primaryColor");
    if (savedColor) {
      document.documentElement.classList.add(savedColor);
      setPrimaryColor(savedColor);
    }

    const savedMode = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedMode) {
      setMode(savedMode);
      setTheme(savedMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typography]);


  const [user, setUser] = React.useState<Usuario | null>(null);

  React.useEffect(() => {
    const usuario = localStorage.getItem("user");
    if (usuario) {
      try {
        setUser(JSON.parse(usuario));
      } catch (error) {
        toast.error("Erro ao recuperar os dados do usuário.");
      }
    }
  }, []);

  const handleSubmit = () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    newErrors.oldPassword = validateRequired(oldPassword, "Senha atual");
    newErrors.newPassword = validatePassword(password);
    newErrors.confirmPassword = validateRequired(confirmPassword, "Nova senha");
    newErrors.igualPassword = validatePasswordMatch(password, confirmPassword);

    if (Object.keys(newErrors).length === 0) {
      toast.success("Senha alterada com sucesso!");
    } else {
      setErrors(newErrors);
      showError
    }
  }

  React.useEffect(() => {
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <ButtonTT
            mode="small"
            tooltip="Configurações"
            variant="ghost"
            icon={"FaGear"}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="[&>button:last-child]:hidden full-screen-dialog max-w-full w-full h-full p-0 m-0 overflow-y-auto">
        <div className="container mx-auto h-full flex flex-col justify-center">
          <DialogHeader className="pt-8 pb-4 px-6 sm:px-8 xl:-ml-14 sticky top-0 z-10 xl:bg-transparent bg-background">
            <div className="flex items-center gap-4">
              <DialogClose asChild>
                <ButtonTT
                  mode="small"
                  tooltip="none"
                  variant="ghost"
                  icon={"IoClose"}
                />
              </DialogClose>
              <DialogTitle className="mb-2 text-3xl font-title text-secondary font-bold">
                Configurações
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex flex-col justify-between p-6 md:p-8">
            <section className="flex flex-col">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-40">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    Conta
                  </h2>

                  <div className="space-y-4">
                    <div className="flex flex-wrap md:flex-nowrap items-end justify-center gap-6">
                      <div className="w-32 md:w-auto order-first md:order-last overflow-hidden rounded-full shadow-md mx-auto xs:mx-0">
                        <Avatar className="h-32 w-32">
                          <AvatarImage src={""} alt={user?.nome} />
                          <AvatarFallback>
                            {user?.nome.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="w-full md:flex-1 space-y-2 order-last md:order-first">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome</Label>
                          <Input
                            id="name"
                            defaultValue={user?.nome}
                            readOnly
                            className="bg-card"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email readOnly">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            defaultValue={user?.email}
                            readOnly
                            className="bg-card"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Label>Alterar senha</Label>
                      <TextField
                        id="oldPassword"
                        name="oldPassword"
                        label=""
                        placeholder="Insira a senha atual"
                        type="password"
                        onChange={(e) => setOldPassword(e.target.value)}
                        error={errors.oldPassword}
                      />
                      <TextField
                        id="newPassword"
                        name="newPassword"
                        label=""
                        placeholder="Insira a nova senha"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.newPassword}
                      />
                      <TextField
                        id="confirmPassword"
                        name="confirmPassword"
                        label=""
                        placeholder="Confirme a nova senha"
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword || errors.igualPassword}
                      />
                      <div className="flex justify-end pt-2">
                        <ButtonTT
                          mode="default"
                          tooltip="none"
                          variant={"secondary"}
                          type="submit"
                          onClick={() => handleSubmit()}
                        >
                          Alterar senha
                        </ButtonTT>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visualization Section */}
                <div className="space-y-6">
                  <h2 className=" mt-10 lg:mt-0 text-xl font-semibold text-foreground">
                    Visualização
                  </h2>

                  <div className="sm:flex flex-col-2">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Modo</Label>
                        <div className="flex gap-2">
                          <ButtonTT
                            mode="default"
                            tooltip="Modo claro"
                            variant={mode === "light" ? "default" : "outline"}
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-md p-0",
                              mode === "light" &&
                              "bg-primary text-secondary-foreground hover:bg-primary/90"
                            )}
                            onClick={() => {
                              setMode("light");
                              setTheme("light");
                              localStorage.setItem("theme", "light");
                            }}
                          >
                            <Sun className="h-5 w-5 dark:text-primary-foreground" />
                          </ButtonTT>
                          <ButtonTT
                            mode="default"
                            tooltip="Modo escuro"
                            variant={mode === "dark" ? "default" : "outline"}
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-md p-0",
                              mode === "dark" &&
                              "bg-primary text-secondary-foreground hover:bg-primary/90"
                            )}
                            onClick={() => {
                              setMode("dark");
                              setTheme("dark");
                              localStorage.setItem("theme", "dark");
                            }}
                          >
                            <Moon className="h-5 w-5 dark:text-primary-foreground" />
                          </ButtonTT>
                        </div>
                      </div>
                      <div>
                        <div className="space-y-2">
                          <Label>Cor principal</Label>
                          <div className="flex gap-2">
                            {colorOptions.map((color, key) => (
                              <ColorButton
                                className={color.value}
                                key={key}
                                color={color.name}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Tipografia</Label>
                        <div className="flex gap-2">
                          <ButtonTT
                            type="button"
                            tooltip="Sans"
                            mode="default"
                            variant={
                              typography === "default" ? "default" : "outline"
                            }
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-md p-0 font-sans",
                              typography === "default" &&
                              "bg-primary text-secondary-foreground hover:bg-primary/90"
                            )}
                            onClick={() => {
                              setTypography("default");
                              localStorage.setItem("typography", "default");
                              document.documentElement.classList.remove(
                                "default",
                                "alternative"
                              );
                              document.documentElement.classList.add("default");
                            }}
                          >
                            <span className="dark:text-primary-foreground">
                              Aa
                            </span>
                          </ButtonTT>
                          <ButtonTT
                            type="button"
                            tooltip="Serifa"
                            mode="default"
                            variant={
                              typography === "alternative"
                                ? "default"
                                : "outline"
                            }
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-md p-0 font-serif ",
                              typography === "alternative" &&
                              "bg-primary text-secondary-foreground hover:bg-primary/90"
                            )}
                            onClick={() => {
                              setTypography("alternative");
                              localStorage.setItem("typography", "alternative");
                              document.documentElement.classList.remove(
                                "default",
                                "alternative"
                              );
                              document.documentElement.classList.add(
                                "alternative"
                              );
                            }}
                          >
                            <span className="dark:text-primary-foreground">
                              Aa
                            </span>
                          </ButtonTT>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Tamanho da fonte</Label>
                        <div className="flex gap-2 saturate-50 brightness-75">
                          {fontSizeOptions.map((size) => (
                            <ButtonTT
                              key={size.value}
                              mode="default"
                              type="button"
                              tooltip="none"
                              variant={
                                fontSize === size.value
                                  ? "secondary"
                                  : "outline"
                              }
                              className={cn(
                                "h-10 w-10 rounded-md",
                                fontSize === size.value &&
                                "bg-primary text-secondary-foreground hover:bg-primary/90"
                              )}
                              onClick={() => setFontSize(size.value)}
                            >
                              {size.name}
                            </ButtonTT>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div className="flex mt-10 justify-end">
              <DialogClose asChild>
                <ButtonTT
                  onClick={handleLogout}
                  mode="default"
                  tooltip="none"
                  variant={"destructive"}
                >
                  Sair da conta
                  <ArrowRight className="h-4 w-4" />
                </ButtonTT>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
