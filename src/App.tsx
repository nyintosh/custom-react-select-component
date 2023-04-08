import { useEffect, useState } from 'react';
import { Select, SelectOption } from './components';

import './App.css';

const options = [
	{ label: 'First', value: 1 },
	{ label: 'Second', value: 2 },
	{ label: 'Third', value: 3 },
	{ label: 'Fourth', value: 4 },
	{ label: 'Fifth', value: 5 },
];

function App() {
	const [value1, setValue1] = useState<SelectOption[]>([]);
	const [value2, setValue2] = useState<SelectOption | undefined>(undefined);

	useEffect(() => {
		window.addEventListener(
			'keydown',
			(e) => {
				if (
					['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
						e.code,
					)
				) {
					e.preventDefault();
				}
			},
			false,
		);
	}, []);

	return (
		<main>
			<section>
				<h1>Custom React Select Component</h1>
			</section>

			<section>
				<div>
					<div>
						<p>Single-select</p>

						<Select
							onChange={(v) => setValue2(v)}
							options={options}
							value={value2}
						/>
					</div>
				</div>

				<div>
					<div>
						<p>Multi-select</p>

						<Select
							onChange={(v) => setValue1(v)}
							multiple
							options={options}
							value={value1}
						/>
					</div>
				</div>
			</section>

			<section>
				<p>have a good one...</p>
			</section>
		</main>
	);
}

export default App;
