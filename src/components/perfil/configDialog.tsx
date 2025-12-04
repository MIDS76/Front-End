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
import {
  showError,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
} from "@/utils/formValidation";

export function ConfigDialog() {
  const [isOpen, setOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [oldPassword, setOldPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [primaryColor, setPrimaryColor] = React.useState<string>("blue");
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const [typography, setTypography] = React.useState<"default" | "alternative">(
    "default"
  );
  const [fontSize, setFontSize] = React.useState<number>(16);

  const fontSizeOptions = [
    { name: "P", value: 16 },
    { name: "M", value: 18 },
    { name: "G", value: 20 },
  ];

  const colorOptions = [
    { name: "green", className: "bg-[#2B5E64] hover:bg-[#2B5E64]/90" },
    { name: "blue", className: "bg-[#2B3347] hover:bg-[#2B3347]/90" },
    { name: "purple", className: "bg-[#462772] hover:bg-[#462772]/90" },
    { name: "pink", className: "bg-[#8D2065] hover:bg-[#8D2065]/90" },
    { name: "orange", className: "bg-[#825A2C] hover:bg-[#825A2C]/90" },
  ];

  const { setTheme } = useTheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };


  function savePreferences(prefs?: {
    primaryColor?: string;
    mode?: "light" | "dark";
    typography?: "default" | "alternative";
    fontSize?: number;
  }) {
    const current = {
      primaryColor,
      mode,
      typography,
      fontSize,
      ...prefs,
    };
    localStorage.setItem("userPreferences", JSON.stringify(current));
  }

  function applyPrimaryColor(color: string) {
    document.documentElement.classList.remove(
      "green",
      "blue",
      "purple",
      "pink",
      "orange"
    );
    document.documentElement.classList.add(color);
  }

  function applyThemeClass(themeValue: "light" | "dark") {
    // next-themes usually handles theme classes, but garantimos a classe no html
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(themeValue);
  }

  function applyTypographyClass(type: "default" | "alternative") {
    // adiciona tanto .default quanto .typography-default para maior compatibilidade com teu CSS
    document.documentElement.classList.remove(
      "default",
      "alternative",
      "typography-default",
      "typography-alternative"
    );
    if (type === "default") {
      document.documentElement.classList.add("default", "typography-default");
    } else {
      document.documentElement.classList.add(
        "alternative",
        "typography-alternative"
      );
    }
  }

  function applyFontSize(size: number) {
    // aplica direto no root
    document.documentElement.style.fontSize = `${size}px`;
  }

  React.useEffect(() => {
    // Carregar preferências ao iniciar
    const saved = localStorage.getItem("userPreferences");
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        if (prefs.primaryColor) {
          setPrimaryColor(prefs.primaryColor);
          applyPrimaryColor(prefs.primaryColor);
        }
        if (prefs.mode) {
          setMode(prefs.mode);
          setTheme(prefs.mode);
          applyThemeClass(prefs.mode);
        }
        if (prefs.typography) {
          setTypography(prefs.typography);
          applyTypographyClass(prefs.typography);
        }
        if (prefs.fontSize) {
          setFontSize(Number(prefs.fontSize));
          applyFontSize(Number(prefs.fontSize));
        }
      } catch (err) {
        // nada, mantém padrão
      }
    } else {
      // aplica defaults
      applyPrimaryColor(primaryColor);
      applyTypographyClass(typography);
      applyThemeClass(mode);
      applyFontSize(fontSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------
  // Handlers de UI (sempre salvam e aplicam)
  // --------------------------------------------------
  function handleSetTheme(value: "light" | "dark") {
    setMode(value);
    setTheme(value);
    applyThemeClass(value);
    savePreferences({ mode: value });
  }

  function handleSetColor(value: string) {
    setPrimaryColor(value);
    applyPrimaryColor(value);
    savePreferences({ primaryColor: value });
  }

  function handleSetTypography(value: "default" | "alternative") {
    setTypography(value);
    applyTypographyClass(value);
    savePreferences({ typography: value });
  }

  function handleSetFontSize(value: number) {
    setFontSize(value);
    applyFontSize(value);
    savePreferences({ fontSize: value });
  }

  
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

  // --------------------------------------------------
  // Alterar senha -> chama o backend
  // --------------------------------------------------
  const handleSubmit = async () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    newErrors.oldPassword = validateRequired(oldPassword, "Senha atual");
    newErrors.newPassword = validatePassword(password);
    newErrors.confirmPassword = validateRequired(
      confirmPassword,
      "Confirme a nova senha"
    );
    newErrors.igualPassword = validatePasswordMatch(password, confirmPassword);

    // limpa campos vazios do objeto
    Object.keys(newErrors).forEach((k) => {
      if (!newErrors[k]) delete newErrors[k];
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // se tiver uma utilidade showError, chama; caso contrário, toast
      try {
        // @ts-ignore
        if (typeof showError === "function") showError(newErrors);
      } catch {
        toast.error("Verifique os campos do formulário.");
      }
      return;
    }

    // envia pro backend
    try {
      const res = await fetch("/api/usuario/alterar-senha", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senhaAtual: oldPassword,
          novaSenha: password,
          confirmarSenha: confirmPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.message || "Erro ao alterar a senha.";
        toast.error(msg);
        return;
      }

      toast.success("Senha alterada com sucesso!");
      // limpar campos sensíveis (não salvar localmente)
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Erro de conexão ao tentar alterar a senha.");
    }
  };

  React.useEffect(() => {
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <ButtonTT mode="small" tooltip="Configurações" variant="ghost" icon={"FaGear"} />
        </div>
      </DialogTrigger>

      <DialogContent className="[&>button:last-child]:hidden full-screen-dialog max-w-full w-full h-full p-0 m-0 overflow-y-auto">
        <div className="container mx-auto h-full flex flex-col justify-center">
          <DialogHeader className="pt-8 pb-4 px-6 sm:px-8 xl:-ml-14 sticky top-0 z-10 xl:bg-transparent bg-background">
            <div className="flex items-center gap-4">
              <DialogClose asChild>
                <ButtonTT mode="small" tooltip="none" variant="ghost" icon={"IoClose"} />
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
                  <h2 className="text-xl font-semibold text-foreground">Conta</h2>

                  <div className="space-y-4">
                    <div className="flex flex-wrap md:flex-nowrap items-end justify-center gap-6">
                      <div className="w-32 md:w-auto order-first md:order-last overflow-hidden rounded-full shadow-md mx-auto xs:mx-0">
                        <Avatar className="h-32 w-32">
                          <AvatarImage src={""} alt={user?.nome} />
                          <AvatarFallback>{user?.nome?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="w-full md:flex-1 space-y-2 order-last md:order-first">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome</Label>
                          <Input id="name" defaultValue={user?.nome} readOnly className="bg-card" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={user?.email} readOnly className="bg-card" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Label>Alterar senha</Label>
                      <TextField id="oldPassword" name="oldPassword" label="" placeholder="Insira a senha atual" type="password" onChange={(e) => setOldPassword(e.target.value)} value={oldPassword} error={errors.oldPassword} />
                      <TextField id="newPassword" name="newPassword" label="" placeholder="Insira a nova senha" type="password" onChange={(e) => setPassword(e.target.value)} value={password} error={errors.newPassword} />
                      <TextField id="confirmPassword" name="confirmPassword" label="" placeholder="Confirme a nova senha" type="password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} error={errors.confirmPassword || errors.igualPassword} />
                      <div className="flex justify-end pt-2">
                        <ButtonTT mode="default" tooltip="none" variant={"secondary"} type="submit" onClick={() => handleSubmit()}>
                          Alterar senha
                        </ButtonTT>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visualization Section */}
                <div className="space-y-6">
                  <h2 className=" mt-10 lg:mt-0 text-xl font-semibold text-foreground">Visualização</h2>

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
                              mode === "light" && "bg-primary text-secondary-foreground hover:bg-primary/90"
                            )}
                            onClick={() => handleSetTheme("light")}
                          >
                            <Sun className="h-5 w-5 dark:text-primary-foreground" />
                          </ButtonTT>

                          <ButtonTT
                            mode="default"
                            tooltip="Modo escuro"
                            variant={mode === "dark" ? "default" : "outline"}
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-md p-0",
                              mode === "dark" && "bg-primary text-secondary-foreground hover:bg-primary/90"
                            )}
                            onClick={() => handleSetTheme("dark")}
                          >
                            <Moon className="h-5 w-5 dark:text-primary-foreground" />
                          </ButtonTT>
                        </div>
                      </div>

                      <div>
                        <div className="space-y-2">
                          <Label>Cor principal</Label>
                          <div className="flex gap-2">
                            {colorOptions.map((color) => (
                              <button
                                key={color.name}
                                className={cn("h-10 w-10 rounded-md", color.className, primaryColor === color.name && "ring-2 ring-offset-1")}
                                onClick={() => handleSetColor(color.name)}
                                aria-label={`Cor ${color.name}`}
                                type="button"
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
                            variant={typography === "default" ? "default" : "outline"}
                            className={cn("flex h-10 w-10 items-center justify-center rounded-md p-0 font-sans", typography === "default" && "bg-primary text-secondary-foreground hover:bg-primary/90")}
                            onClick={() => handleSetTypography("default")}
                          >
                            <span className="dark:text-primary-foreground">Aa</span>
                          </ButtonTT>

                          <ButtonTT
                            type="button"
                            tooltip="Serifa"
                            mode="default"
                            variant={typography === "alternative" ? "default" : "outline"}
                            className={cn("flex h-10 w-10 items-center justify-center rounded-md p-0 font-serif", typography === "alternative" && "bg-primary text-secondary-foreground hover:bg-primary/90")}
                            onClick={() => handleSetTypography("alternative")}
                          >
                            <span className="dark:text-primary-foreground">Aa</span>
                          </ButtonTT>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Tamanho da fonte</Label>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-2">
                            {fontSizeOptions.map((s) => (
                              <ButtonTT
                                key={s.value}
                                mode="default"
                                type="button"
                                tooltip="none"
                                variant={fontSize === s.value ? "secondary" : "outline"}
                                className={cn("h-10 w-10 rounded-md", fontSize === s.value && "bg-primary text-secondary-foreground hover:bg-primary/90")}
                                onClick={() => handleSetFontSize(s.value)}
                              >
                                {s.name}
                              </ButtonTT>
                            ))}
                          </div>

                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex mt-10 justify-end">
              <DialogClose asChild>
                <ButtonTT onClick={handleLogout} mode="default" tooltip="none" variant={"destructive"}>
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
