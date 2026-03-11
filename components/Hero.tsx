"use client";
import gsap from "gsap";
import Image from "next/image";
import { hero } from "@public";
import { Navbar } from "@/components";
import { TextMask } from "@animation";
import { useLayoutEffect } from "react";

export default function Hero() {
	const phares1 = [
		"Web developer and robotics enthusiast with experience in front-end and back-end development, UI/UX design, and API integration. Skilled in building and programming robotic systems using sensors, motors, and embedded controllers.",
	];
	const phares2 = [
		"Strong understanding of cybersecurity principles to create secure and reliable solutions across both software and robotics domains. Passionate about building intelligent systems, modern web applications, and secure technology solutions.",
	];
	useLayoutEffect(() => {
		const textWrapper = document.querySelector(".ml12");
		if (textWrapper && textWrapper.textContent) {
			textWrapper.innerHTML = textWrapper.textContent.replace(
				/\S/g,
				"<span class='letter'>$&</span>",
			);
		}

		gsap.timeline().from(".ml12 .letter", {
			opacity: 0,
			stagger: {
				amount: 0.5,
				grid: "auto",
				from: "random",
			},
			delay: 0.5,
			duration: 1,
			ease: "power2.out",
		});

		gsap.to("nav", {
			top: 0,
			ease: "power3.inOut",
			duration: 1,
			delay: 0.5,
		});

		gsap.fromTo(".hero-img", 
			{
				opacity: 0,
				scale: 0.95,
			},
			{
				opacity: 1,
				scale: 1,
				duration: 1,
				delay: 0.5,
				ease: "power4.inOut",
			}
		);

		gsap.to(".header .col p", {
			left: 0,
			opacity: 1,
			duration: 1,
			delay: 0.5,
			ease: "power2.inOut",
		});
	}, []);
	return (
		<section className="w-full h-screen relative py-[20px] sm:py-[10px]">
			<Navbar />
			<div className="w-full h-full flex flex-col gap-[30px] sm:gap-[15px] pt-[8vh] sm:pt-[10vh] overflow-hidden">
				<div className="header w-full flex gap-[30px] sm:gap-[15px] justify-between sm:flex-col">
					<div className="col flex-1">
						<h1 className="ml12 text-[70px] sm:text-[35px] md:text-[45px] inline-block font-bold leading-none tracking-tight uppercase">
							Building intelligent <br /> systems & web apps.
						</h1>
					</div>
					<div className="col flex flex-1 flex-col gap-[10px] sm:gap-[8px]">
						<p className="relative opacity-0 text-[18px] sm:text-[14px] md:text-[16px] inline-block leading-normal tracking-wide">
							<TextMask>{phares1}</TextMask>
						</p>
						<p className="relative opacity-0 text-[18px] sm:text-[14px] md:text-[16px] inline-block leading-normal tracking-wide sm:hidden">
							<TextMask>{phares2}</TextMask>
						</p>
					</div>
				</div>
				<div className="hero-img w-full h-[60vh] sm:h-[35vh] md:h-[45vh]">
					<Image
						src={hero}
						alt="heroImg"
						className="w-full h-full object-cover rounded-[10px] sm:rounded-[5px]"
					/>
				</div>
			</div>
		</section>
	);
}
