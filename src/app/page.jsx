import styles from './page.module.css'

import Header from '@/components/landing page/header/header'
import Hero from '@/components/landing page/hero/hero';
import StoreSection from '@/components/landing page/store/store';
import About from '@/components/landing page/about/about';
import Footer from '@/components/landing page/footer/footer'

export default function Home() {
	return (
		<div className={styles.wrapper}>
			<Header />

			<main>
				<Hero />

				<StoreSection />

				<About />
			</main>

			<Footer />
		</div>
	)
}
