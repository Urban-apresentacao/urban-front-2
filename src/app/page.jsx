import styles from './page.module.css'

import Header from '@/components/header/header'
import Hero from '@/components/hero/hero';
import About from '@/components/about/about';
import Services from '@/components/services/services';
import Footer from '@/components/footer/footer'

export default function Home() {
	return (
		<div className={styles.wrapper}>
			<Header />

			<main>
				<Hero />

				<About />

				<Services />
			</main>

			<Footer />
		</div>
	)
}
