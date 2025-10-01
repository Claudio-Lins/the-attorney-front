"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DotIcon, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export function ServicesCards() {
	const t = useTranslations("HomeData");
	const services = t.raw("servicesSectionData.services") as Array<{
		title: string;
		description: string;
		topics: string[];
		whatsAppMessage?: string;
	}>;
	const [isOpen, setIsOpen] = useState(false);
	const [selectedService, setSelectedService] = useState(services[0]);
	const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

	function handleOpenDialog(service: (typeof services)[0]) {
		setSelectedService(service);
		setIsOpen(true);
	}

	useEffect(() => {
		for (let i = 0; i < cardsRef.current.length; i++) {
			const card = cardsRef.current[i];
			if (card) card.style.height = "auto";
		}
		setTimeout(() => {
			const heights = cardsRef.current.map((card) => card?.offsetHeight || 0);
			const maxHeight = Math.max(...heights);
			for (let i = 0; i < cardsRef.current.length; i++) {
				const card = cardsRef.current[i];
				if (card) card.style.height = `${maxHeight}px`;
			}
		}, 100);
	}, []);

	function setCardRef(el: HTMLDivElement | null, idx: number) {
		cardsRef.current[idx] = el;
	}

	return (
		<div className="flex flex-wrap gap-4 md:gap-12 justify-center">
			{services.map((item, idx) => (
				<Card key={item.title} className="w-full flex flex-col max-w-sm z-[1]" ref={(el) => setCardRef(el, idx)}>
					<CardHeader>
						<CardTitle className="text-xl font-bold text-zinc-950 uppercase tracking-wide leading-tight md:text-2xl text-center border-b pb-4">
							{item.title}
						</CardTitle>
					</CardHeader>
					<CardContent className="flex-1">
						<div className="space-y-4">
							{item.topics.map((topic) => (
								<div key={topic} className="flex items-start gap-2">
									<DotIcon className="size-4 mt-1 shrink-0 text-zinc-950" />
									<p className="text-gray-600 text-sm font-medium">{topic}</p>
								</div>
							))}
						</div>
					</CardContent>
					<CardFooter className="flex justify-between mt-auto pt-6 border-t">
						<Button variant="outline" onClick={() => handleOpenDialog(item)}>
							{t("servicesSectionData.buttonService")}
						</Button>
					</CardFooter>
					<Dialog open={isOpen} onOpenChange={setIsOpen} key={item.title}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle className="text-2xl text-balance font-bold text-zinc-950 uppercase tracking-wide leading-tight">
									{selectedService.title}
								</DialogTitle>
								<Separator className="my-4" />
								<DialogDescription className="text-gray-600 text-sm font-medium text-balance leading-relaxed tracking-wide">
									{selectedService.description}
								</DialogDescription>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				</Card>
			))}
		</div>
	);
}
