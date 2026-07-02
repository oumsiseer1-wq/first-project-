import Link from 'next/link';
import { SparklesIcon } from '../components/ui/icons';

export default function PaymentPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
			<div className="border-b border-zinc-200 dark:border-zinc-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
					<Link href="/" className="flex items-center gap-2">
						<SparklesIcon className="w-6 h-6 text-zinc-900 dark:text-white" />
						<span className="text-xl font-semibold text-zinc-900 dark:text-white">Mindful Spend</span>
					</Link>
				</div>
			</div>

			<main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl">
					<h1 className="text-3xl font-semibold text-zinc-900 dark:text-white mb-4">Payment</h1>
					<p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
						Payment functionality is not configured in this demo.
					</p>
				</div>
			</main>
		</div>
	);
}
