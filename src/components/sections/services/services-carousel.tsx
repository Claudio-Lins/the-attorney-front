"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { DotIcon, MessageCircle } from "lucide-react";
import { useState } from "react";

const services = [
	{
		id: 1,
		title: "Autorização de Residência",
		topics: [
			"Obtenção de vistos e autorizações de residência para trabalho, estudo ou investimento.",
			"Regulação da situação de imigrantes que já estão em Portugal.",
			"Assessoria para o Golden Visa e outros regimes especiais.",
		],
		description:
			"Obtenção de vistos e autorizações de residência para trabalho, estudo ou investimento. Nossa equipe especializada em imigração pode ajudá-lo a navegar pelo processo de obtenção de autorização de residência em Portugal. Além disso, oferecemos assessoria para a obtenção do Golden Visa e outros regimes especiais, garantindo que você tenha todas as informações necessárias para uma transição suave.",
		whatsAppMessage: "Olá, vi no site sobre Autorização de Residência e gostaria de mais informações.",
	},
	{
		id: 2,
		title: "Nacionalidade e Cidadania Portuguesa",
		topics: [
			"Aquisição da cidadania por descendência (pais, avós ou bisavós portugueses).",
			"Naturalização por tempo de residência em Portugal.",
			"Cidadania para cônjuges de cidadãos portugueses.",
			"Cidadania para filhos de cidadãos portugueses.",
			"Cidadania para pais de cidadãos portugueses.",
		],
		description:
			"Aquisição da cidadania por descendência (pais, avós ou bisavós portugueses). Nossa equipe pode ajudá-lo a entender os requisitos e processos envolvidos na aquisição da cidadania portuguesa, seja por descendência ou naturalização. Além disso, oferecemos orientação para cônjuges, filhos e pais de cidadãos portugueses que buscam obter a cidadania.",
		whatsAppMessage: "Olá, vi no site sobre Nacionalidade e Cidadania Portuguesa e gostaria de mais informações.",
	},
	{
		id: 3,
		title: "Reagrupamento Familiar",
		topics: [
			"Processos para trazer familiares para morar legalmente em Portugal.",
			"Assessoria para garantir a comprovação dos vínculos familiares.",
		],
		description:
			"Processos para trazer familiares para morar legalmente em Portugal. Nossa equipe pode ajudá-lo a entender os processos e requisitos para o reagrupamento familiar em Portugal, garantindo que você tenha todas as informações necessárias para uma reunião familiar suave.",
		whatsAppMessage: "Olá, vi no site sobre Reagrupamento Familiar e gostaria de mais informações.",
	},
	{
		id: 4,
		title: "Recursos e Contestações",
		topics: [
			"Defesa contra recusas de vistos ou autorizações de residência.",
			"Representação em casos de expulsão ou deportação.",
			"Recursos administrativos junto à AIMA (Agência para a Imigração, Mobilidade e Asilo) e SEF.",
		],
		description:
			"Defesa contra recusas de vistos ou autorizações de residência. Nossa equipe pode ajudá-lo a defender seus direitos em casos de recusa de vistos ou autorizações de residência, além de representá-lo em casos de expulsão ou deportação. Além disso, oferecemos recursos administrativos para garantir que você tenha todas as oportunidades de defender seu caso.",
		whatsAppMessage: "Olá, vi no site sobre Recursos e Contestações e gostaria de mais informações.",
	},
	{
		id: 5,
		title: "Assessoria para Empresas e Trabalhadores",
		topics: [
			"Obtenção de autorizações para profissionais estrangeiros trabalharem legalmente em Portugal.",
			"Assessoria para empresas contratarem mão de obra estrangeira.",
		],
		description:
			"Assessoria para empresas contratarem mão de obra estrangeira. Nossa equipe pode ajudá-lo a entender os processos e requisitos para a contratação de mão de obra estrangeira em Portugal, garantindo que você tenha todas as informações necessárias para uma contratação legal e segura.",
		whatsAppMessage: "Olá, vi no site sobre Assessoria para Empresas e Trabalhadores e gostaria de mais informações.",
	},
	{
		id: 6,
		title: "Proteção Internacional e Asilo",
		topics: [
			"Orientação para refugiados e requerentes de asilo.",
			"Processo legal para obtenção de proteção humanitária.",
		],
		description:
			"Orientação para refugiados e requerentes de asilo. Nossa equipe pode ajudá-lo a entender os processos e requisitos para a obtenção de proteção internacional e asilo em Portugal, garantindo que você tenha todas as informações necessárias para uma solicitação bem-sucedida.",
		whatsAppMessage: "Olá, vi no site sobre Proteção Internacional e Asilo e gostaria de mais informações.",
	},
	{
		id: 7,
		title: "Regularização Fiscal e Jurídica",
		topics: [
			"Apoio na obtenção do NIF (Número de Identificação Fiscal).",
			"Registro na Segurança Social para acesso a benefícios e direitos.",
		],
		description:
			"Apoio na obtenção do NIF (Número de Identificação Fiscal). Nossa equipe pode ajudá-lo a entender os processos e requisitos para a obtenção do NIF e o registro na Segurança Social em Portugal, garantindo que você tenha todas as informações necessárias para uma integração fiscal e jurídica suave.",
		whatsAppMessage: "Olá, vi no site sobre Regularização Fiscal e Jurídica e gostaria de mais informações.",
	},
];

export function ServicesCarousel() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="relative w-full max-w-7xl mx-auto px-4">
			<Carousel
				opts={{
					align: "center",
					loop: false,
					skipSnaps: true,
					dragFree: false,
				}}
				className="mx-auto"
			>
				<CarouselContent className="-ml-2 md:-ml-4">
					{services.map((item) => (
						<CarouselItem key={item.id} className="pl-1 md:pl-4 basis-[95%] md:basis-1/2 lg:basis-1/3 relative z-10">
							<Card className="h-full flex flex-col">
								<CardHeader>
									<CardTitle className="text-xl font-bold text-zinc-950 uppercase tracking-wide leading-tight md:text-2xl text-center border-b pb-4">
										{item.title}
									</CardTitle>
								</CardHeader>
								<CardContent className="flex-1">
									<div className="space-y-4">
										{item.topics.map((topic) => (
											<div key={topic} className="flex items-start gap-2">
												<DotIcon className="size-8 shrink-0 text-zinc-950-600" />
												<p className="text-gray-600 text-sm font-bold">{topic}</p>
											</div>
										))}
									</div>
								</CardContent>
								<CardFooter className="flex justify-between mt-auto pt-6 border-t">
									<Button onClick={() => setIsOpen(true)}>Saiba mais</Button>
									<Button asChild variant="secondary">
										<a
											href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${item.whatsAppMessage}`}
											target="_blank"
											rel="noreferrer"
										>
											<MessageCircle className="mr-2" />
											Contato
										</a>
									</Button>
								</CardFooter>
							</Card>
							<Dialog open={isOpen} onOpenChange={setIsOpen}>
								<DialogContent className="">
									<DialogHeader>
										<DialogTitle className="text-2xl text-balance font-bold text-zinc-950 uppercase tracking-wide leading-tight">
											{item.title}
										</DialogTitle>
										<Separator className="my-4" />
										<DialogDescription className="text-gray-600 text-sm font-medium text-balance leading-relaxed tracking-wide">
											{item.description}
										</DialogDescription>
									</DialogHeader>
								</DialogContent>
							</Dialog>
						</CarouselItem>
					))}
				</CarouselContent>
				<div className="hidden md:block">
					<CarouselPrevious className="absolute -left-12 top-1/2" />
					<CarouselNext className="absolute -right-12 top-1/2" />
				</div>
			</Carousel>
		</div>
	);
}
