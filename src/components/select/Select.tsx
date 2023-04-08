import { useEffect, useRef, useState } from 'react';
import styles from './select.module.css';

export type SelectOption = {
	label: string;
	value: string | number;
};

type SingleSelectProps = {
	onChange: (value: SelectOption | undefined) => void;
	multiple?: false;
	value?: SelectOption;
};

type MultiSelectProps = {
	onChange: (value: SelectOption[]) => void;
	multiple: true;
	value: SelectOption[];
};

type SelectProps = {
	options: SelectOption[];
} & (SingleSelectProps | MultiSelectProps);

const Select = ({ onChange, options, value, multiple }: SelectProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const [highlightedIndex, setHighlightedIndex] = useState(0);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.target != containerRef.current) return;

			switch (e.code) {
				case 'Enter':
				case 'Space':
					setIsOpen((prev) => !prev);
					if (isOpen) selectOption(options[highlightedIndex]);
					break;

				case 'ArrowUp':
				case 'ArrowDown': {
					if (!isOpen) {
						setIsOpen(true);
						break;
					}

					const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);

					if (newValue >= 0 && newValue < options.length) {
						setHighlightedIndex(newValue);
					}

					break;
				}

				case 'Escape':
					setIsOpen(false);
					break;
			}
		};

		containerRef.current?.addEventListener('keydown', handler);

		return () => {
			containerRef.current?.removeEventListener('keydown', handler);
		};
	}, [isOpen, highlightedIndex, options]);

	useEffect(() => {
		setHighlightedIndex(0);
	}, [isOpen]);

	function clearOptions() {
		multiple ? onChange([]) : onChange(undefined);
	}

	function selectOption(option: SelectOption) {
		if (multiple) {
			if (value.includes(option)) {
				onChange(value.filter((v) => v !== option));
			} else {
				onChange([...value, option]);
			}
		} else {
			if (option !== value) onChange(option);
		}
	}

	function isOptionSelected(option: SelectOption) {
		return multiple ? value.includes(option) : option === value;
	}

	return (
		<div
			onBlur={() => setIsOpen(false)}
			onClick={() => setIsOpen((prev) => !prev)}
			className={styles.container}
			ref={containerRef}
			tabIndex={0}
		>
			<span className={styles.value}>
				{multiple
					? value.map((v) => (
							<button
								key={v.value}
								onClick={(e) => {
									e.stopPropagation();
									selectOption(v);
								}}
								className={styles['option-badge']}
							>
								{v.label}
								<span className={styles['remove-btn']}>&times;</span>
							</button>
					  ))
					: value?.label}
			</span>

			{(multiple ? value.length >= 1 : !!value) && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						clearOptions();
					}}
					className={styles['clear-btn']}
				>
					&times;
				</button>
			)}

			<div className={styles.divider} />
			<div className={styles.caret} />

			<ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
				{options.map((option, idx) => (
					<li
						key={option.label}
						onClick={(e) => {
							e.stopPropagation();
							selectOption(option);
							setIsOpen(false);
						}}
						onMouseEnter={() => setHighlightedIndex(idx)}
						className={`${styles.option} ${
							isOptionSelected(option) ? styles.selected : ''
						} ${idx === highlightedIndex ? styles.highlighted : ''}`}
					>
						{option.label}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Select;
