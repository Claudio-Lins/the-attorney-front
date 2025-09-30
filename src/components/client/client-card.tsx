"use client"

import { sendInvitationAction } from "@/actions/send-invitation-action"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { address, client } from "@/generated/prisma/client"
import {
	Building2,
	Calendar,
	Clock,
	FileText,
	Globe,
	Home,
	Mail,
	MapPin,
	Phone,
	Shield,
	User,
	UserCheck,
	Users,
} from "lucide-react"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { EditClientDialog } from "./edit-client-dialog"

interface ClientDataProps {
  clientData: client & { address?: address[] }
}

export function ClientCard({ clientData }: ClientDataProps) {
  const [isSending, setIsSending] = useState(false)

  const handleSendInvitation = async () => {
    setIsSending(true)
    try {
      const result = await sendInvitationAction({
        passportNumber: clientData.passport_number,
        email: clientData.email,
        phone: clientData.phone,
      })

      if (result === "ok") {
        toast.success("Convite enviado com sucesso!")
      } else {
        toast.error("Falha ao enviar convite. Verifique o console para mais detalhes.")
      }
    } catch (error) {
      console.error("Erro ao enviar convite:", error)
      toast.error("Ocorreu um erro inesperado.")
    } finally {
      setIsSending(false)
    }
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getGenderLabel = (gender: string | null) => {
    if (!gender) return "N/A"
    return gender === "M" ? "Masculino" : "Feminino"
  }

  const getMaritalStatusLabel = (status: string | null) => {
    if (!status) return "N/A"
    const statusMap = {
      SINGLE: "Solteiro(a)",
      MARRIED: "Casado(a)",
      DIVORCED: "Divorciado(a)",
      WIDOWED: "Viúvo(a)",
      SEPARATED: "Separado(a)",
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getInitials = (first_name: string, last_name: string) => {
    return `${first_name.charAt(0)}${last_name.charAt(0)}`.toUpperCase()
  }

  const isPassportExpiringSoon = (passport_expiry: Date | null) => {
    if (!passport_expiry) return false
    const now = new Date()
    const expiry = new Date(passport_expiry)
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 90 && diffDays > 0
  }

  const isPassportExpired = (passport_expiry: Date | null) => {
    if (!passport_expiry) return false
    return new Date(passport_expiry) < new Date()
  }

  const filiation = clientData.filiation as { father?: string; mother?: string } | null

  const PersonalDataContent = () => (
    <div className="space-y-6">
      <Section title="Informações Pessoais" icon={<User className="w-5 h-5" />}>
        <InfoGrid>
          <InfoItem label="Nome Completo">
            <span className="font-medium text-foreground">
              {clientData.first_name} {clientData.last_name}
            </span>
          </InfoItem>
          <InfoItem label="Data de Nascimento" icon={<Calendar className="w-4 h-4" />}>
            <span className="font-medium text-foreground">{formatDate(clientData.date_of_birth ?? "")}</span>
          </InfoItem>
          <InfoItem label="Gênero">
            <Badge variant="outline" className="font-normal">
              {getGenderLabel(clientData.gender ?? "")}
            </Badge>
          </InfoItem>
          <InfoItem label="Estado Civil">
            <Badge variant="outline" className="font-normal">
              {getMaritalStatusLabel(clientData.marital_status ?? "")}
            </Badge>
          </InfoItem>
          <InfoItem label="Nacionalidade" icon={<Globe className="w-4 h-4" />}>
            <span className="font-medium text-foreground">{clientData.nationality}</span>
          </InfoItem>
          <InfoItem label="País de Nascimento" icon={<MapPin className="w-4 h-4" />}>
            <span className="font-medium text-foreground">{clientData.country_of_birth}</span>
          </InfoItem>
          <InfoItem label="Local de Nascimento">
            <span className="font-medium text-foreground">{clientData.place_of_birth}</span>
          </InfoItem>
        </InfoGrid>
      </Section>

      <Section title="Filiação" icon={<Users className="w-5 h-5" />}>
        <InfoGrid>
          <InfoItem label="Nome do Pai">
            <span className="font-medium text-foreground">{filiation?.father ?? "Não informado"}</span>
          </InfoItem>
          <InfoItem label="Nome da Mãe">
            <span className="font-medium text-foreground">{filiation?.mother ?? "Não informado"}</span>
          </InfoItem>
        </InfoGrid>
      </Section>
    </div>
  )

  const ContactContent = () => (
    <div className="space-y-6">
      <Section title="Informações de Contato" icon={<Mail className="w-5 h-5" />}>
        <InfoGrid>
          <InfoItem label="Email" icon={<Mail className="w-4 h-4" />}>
            <span className="font-mono text-sm text-foreground">{clientData.email}</span>
          </InfoItem>
          <InfoItem label="Telefone" icon={<Phone className="w-4 h-4" />}>
            <span className="font-mono text-sm text-foreground">{clientData.phone}</span>
          </InfoItem>
        </InfoGrid>
      </Section>

      <Section title="Endereços" icon={<Home className="w-5 h-5" />}>
        {clientData.address && clientData.address.length > 0 ? (
          <div className="space-y-4">
            {clientData.address.map((address, index) => (
              <div key={address.id} className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Badge variant="secondary" className="text-xs font-mono mb-2">
                      Endereço {index + 1}
                    </Badge>
                    <p className="font-medium text-foreground">
                      {address.street}, {address.number}
                      {address.complement && `, ${address.complement}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.neighborhood} - {address.city}/{address.state}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">CEP: {address.zip_code}</p>
                    <p className="text-sm text-muted-foreground">{address.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Home className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado</p>
          </div>
        )}
      </Section>
    </div>
  )

  const DocumentationContent = () => (
    <Section title="Documentação" icon={<FileText className="w-5 h-5" />}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InfoItem label="Número do Passaporte">
              <div className="bg-muted px-4 py-2 rounded-md font-mono text-sm font-medium">
                {clientData.passport_number}
              </div>
            </InfoItem>
            <InfoItem label="Data de Emissão" icon={<Calendar className="w-4 h-4" />}>
              <span className="font-mono text-sm text-foreground">
                {formatDate(clientData.passport_issue_date ?? "")}
              </span>
            </InfoItem>
            <InfoItem label="Data de Expiração" icon={<Calendar className="w-4 h-4" />}>
              <div
                className={`font-mono text-sm font-medium px-4 py-2 rounded-md ${
                  isPassportExpired(clientData.passport_expiry)
                    ? "bg-destructive/10 text-destructive"
                    : isPassportExpiringSoon(clientData.passport_expiry)
                      ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500"
                      : "bg-green-500/10 text-green-700 dark:text-green-500"
                }`}
              >
                {formatDate(clientData.passport_expiry ?? "")}
              </div>
            </InfoItem>
          </div>
          <div className="bg-muted/50 rounded-lg p-6 border">
            <div className="text-center space-y-3">
              <div
                className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                  isPassportExpired(clientData.passport_expiry)
                    ? "bg-destructive/20"
                    : isPassportExpiringSoon(clientData.passport_expiry)
                      ? "bg-yellow-500/20"
                      : "bg-green-500/20"
                }`}
              >
                <Shield
                  className={`w-6 h-6 ${
                    isPassportExpired(clientData.passport_expiry)
                      ? "text-destructive"
                      : isPassportExpiringSoon(clientData.passport_expiry)
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Status da Documentação</h4>
                <p
                  className={`text-xs font-medium ${
                    isPassportExpired(clientData.passport_expiry)
                      ? "text-destructive"
                      : isPassportExpiringSoon(clientData.passport_expiry)
                        ? "text-yellow-700 dark:text-yellow-500"
                        : "text-green-700 dark:text-green-500"
                  }`}
                >
                  {isPassportExpired(clientData.passport_expiry)
                    ? "Expirado"
                    : isPassportExpiringSoon(clientData.passport_expiry)
                      ? "Expira em breve"
                      : "Válido"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )

  const SystemContent = () => (
    <Section title="Informações do Sistema" icon={<Clock className="w-5 h-5" />}>
      <InfoGrid>
        <InfoItem label="Data de Cadastro" icon={<Calendar className="w-4 h-4" />}>
          <span className="font-mono text-sm text-foreground">{formatDateTime(clientData.created_at)}</span>
        </InfoItem>
        <InfoItem label="Última Atualização" icon={<Clock className="w-4 h-4" />}>
          <span className="font-mono text-sm text-foreground">{formatDateTime(clientData.updated_at)}</span>
        </InfoItem>
        <InfoItem label="ID do Cliente" icon={<Building2 className="w-4 h-4" />}>
          <span className="font-mono text-sm text-foreground">{clientData.client_id}</span>
        </InfoItem>
        <InfoItem label="Status da Conta">
          <Badge variant={clientData.userId ? "default" : "secondary"}>
            {clientData.userId ? "Conta Ativa" : "Aguardando Ativação"}
          </Badge>
        </InfoItem>
      </InfoGrid>
    </Section>
  )

  return (
    <div className="w-full min-h-screen bg-background">
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2">
                  <AvatarImage
                    src={clientData.photo_url ?? ""}
                    alt={`${clientData.first_name} ${clientData.last_name}`}
                  />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(clientData.first_name, clientData.last_name)}
                  </AvatarFallback>
                </Avatar>
                {clientData.userId && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-600 rounded-full border-2 border-background flex items-center justify-center">
                    <UserCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">
                  {clientData.first_name} {clientData.last_name}
                </h1>
                <div className="flex items-center flex-wrap gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    ID: {clientData.client_id}
                  </Badge>
                  <Badge
                    variant={
                      isPassportExpired(clientData.passport_expiry)
                        ? "destructive"
                        : isPassportExpiringSoon(clientData.passport_expiry)
                          ? "secondary"
                          : "default"
                    }
                    className="text-xs"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {isPassportExpired(clientData.passport_expiry)
                      ? "Doc. Expirada"
                      : isPassportExpiringSoon(clientData.passport_expiry)
                        ? "Expira em breve"
                        : "Doc. Válida"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <EditClientDialog clientData={clientData} />
              {!clientData.userId && (
                <Button onClick={handleSendInvitation} disabled={isSending} variant="default">
                  <Mail className="w-4 h-4 mr-2" />
                  {isSending ? "Enviando..." : "Enviar Convite"}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="py-4 px-2 md:p-6">
        {/* Desktop Tabs - hidden on mobile */}
        <div className="hidden md:block">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="personal" className="gap-2">
                <User className="w-4 h-4" />
                <span>Dados Pessoais</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-2">
                <Mail className="w-4 h-4" />
                <span>Contato</span>
              </TabsTrigger>
              <TabsTrigger value="documentation" className="gap-2">
                <FileText className="w-4 h-4" />
                <span>Documentação</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="gap-2">
                <Clock className="w-4 h-4" />
                <span>Sistema</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalDataContent />
            </TabsContent>

            <TabsContent value="contact">
              <ContactContent />
            </TabsContent>

            <TabsContent value="documentation">
              <DocumentationContent />
            </TabsContent>

            <TabsContent value="system">
              <SystemContent />
            </TabsContent>
          </Tabs>
        </div>

        {/* Mobile Carousel - hidden on desktop */}
        <div className="md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <h2 className="text-lg font-semibold">Dados Pessoais</h2>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <PersonalDataContent />
                  </CardContent>
                </Card>
              </CarouselItem>

              <CarouselItem>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      <h2 className="text-lg font-semibold">Contato</h2>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ContactContent />
                  </CardContent>
                </Card>
              </CarouselItem>

              <CarouselItem>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <h2 className="text-lg font-semibold">Documentação</h2>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <DocumentationContent />
                  </CardContent>
                </Card>
              </CarouselItem>

              <CarouselItem>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <h2 className="text-lg font-semibold">Sistema</h2>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SystemContent />
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="ml-3" />
            <CarouselNext className="mr-3" />
          </Carousel>
        </div>
      </div>
    </div>
  )
}

const Section: React.FC<{
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}> = ({ title, icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b">
      <div className="text-muted-foreground">{icon}</div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
    </div>
    <div className="pt-2">{children}</div>
  </div>
)

const InfoGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{children}</div>
)

const InfoItem: React.FC<{
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}> = ({ label, icon, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
      {icon && <div className="w-4 h-4">{icon}</div>}
      {label}
    </div>
    <div className="text-sm">{children}</div>
  </div>
)
