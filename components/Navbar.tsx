import Image from "next/image";
import { logo } from "@public";
import { Menu } from "@components";
import { navVarients } from "@motion";
import { motion } from "framer-motion";

export default function Navbar() {
	return (
		<motion.nav
			variants={navVarients}
			initial="initial"
			animate="vissible"
			className="w-full h-[8vh] flex items-center px-[50px] sm:px-[20px] md:px-[30px] justify-between fixed backdrop-blur-[1.7px] z-[99] top-0 left-0">
			<div className="w-[200px] sm:w-auto">
				<div>
					<Image
						src={logo}
						alt=""
						className="w-[40px] h-[40px] sm:w-[30px] sm:h-[30px] object-cover"
					/>
				</div>
			</div>
			<div className="w-[200px] sm:w-auto flex items-center justify-center">
				<h1 className="text-[30px] sm:text-[20px] md:text-[24px] font-bold tracking-wider text-[#202020] uppercase">
					Vishwas R
				</h1>
			</div>
			<div className="w-[200px] sm:w-auto flex items-center justify-center">
				<Menu />
			</div>
		</motion.nav>
	);
}
